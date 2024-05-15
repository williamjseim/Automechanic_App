using Microsoft.AspNetCore.Mvc;
using HackGame.Api.Filters;
using HackGame.Api.Data;
using Microsoft.EntityFrameworkCore;
using HackGame.Api.Models;

namespace HackGame.Api.Controllers
{
    public class CarController : Controller
    {
        private MechanicDatabase _db;
        private IConfiguration _config;
        public CarController(IConfiguration config, MechanicDatabase db)
        {
            this._config = config;
            this._db = db;
        }

        [JwtTokenAuthorization]
        [HttpGet("Cars")]
        public async Task<IActionResult> Cars(int startingIndex)
        {
            try
            {
                var cars = _db.Cars.Skip(startingIndex).Take(25);
                return Ok(cars);
            }
            catch (Exception ex)
            {
                return NotFound();
            }
        }

        [JwtTokenAuthorization]
        [HttpGet("CreateCar")]
        public async Task<IActionResult> Cars(string make, string model, string plate, string vinnr)
        {
            try
            {
                if(_db.Cars.Where(i=>i.Plate == plate || i.VinNumber == vinnr).Any()) {
                    return BadRequest("Car Already exists check vin or plate");
                }
                Car car = new(vinnr, plate, make, model);
                await _db.AddAsync(car);
                await _db.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                return NotFound();
            }
        }

        [JwtTokenAuthorization]
        [HttpGet("CarIssues")]
        public async Task<IActionResult> GetCarIssues(Guid carId, int startingIndex)
        {
            try
            {
                var issues = _db.CarIssues.Where(i=>i.Id == carId).Skip(startingIndex).Take(25);
                return Ok(issues);
            }
            catch (Exception ex)
            {
                return NotFound();
            }
        }

        [JwtTokenAuthorization]
        [HttpGet("CreateCarIssue")]
        public async Task<IActionResult> CreateCarIssues(Guid carId, string description, decimal price)
        {
            try
            {
                Car car = await _db.Cars.FirstOrDefaultAsync(i=>i.Id == carId);
                if(car == null)
                {
                    return NotFound("Car not found");
                }
                User user = await _db.Users.FirstOrDefaultAsync(i => i.Id == Guid.Empty);
                if(user == null)
                {
                    return Unauthorized("User doesnt exist");
                }

                CarIssue issue = new(car, user, description, price);
                await _db.AddAsync(issue);
                await _db.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                return NotFound();
            }
        }
    }
}
