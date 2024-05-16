using Microsoft.AspNetCore.Mvc;
using Mechanic.Api.Filters;
using Mechanic.Api.Data;
using Microsoft.EntityFrameworkCore;
using Mechanic.Api.Models;
using Mechanic.Api.TokenAuthorization;
using Pomelo.EntityFrameworkCore.MySql.Query.Internal;

namespace Mechanic.Api.Controllers
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
        [HttpGet("GetCars")]
        public async Task<IActionResult> GetCars(int startingIndex, int amount)
        {
            try
            {
                var cars = _db.Cars.Skip(startingIndex).Take(amount);
                return Ok(cars);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return NotFound();
            }
        }

        [JwtTokenAuthorization]
        [HttpGet("CarPages")]
        public async Task<IActionResult> CarPages(int amountPrPage)
        {
            try
            {
                var amount = (int)MathF.Ceiling(_db.Cars.Count()/amountPrPage);
                return Ok(amount);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return NotFound();
            }
        }

        [JwtTokenAuthorization]
        [HttpGet("CreateCar")]
        public async Task<IActionResult> CreateCar(string make, string model, string plate, string vinnr)
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
                Console.WriteLine(ex);
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
                string token = this.HttpContext.Request.Headers.First(i => i.Key == "Bearer").Value;
                User user = await _db.Users.FirstOrDefaultAsync(i => i.Id == JwtAuthorization.GetUserId(token, _config));
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
                Console.WriteLine(ex);
                return NotFound();
            }
        }

        [JwtTokenAuthorization]
        [HttpGet("UpdateCarIssue")]
        public async Task<IActionResult> UpdateCarIssue(Guid IssueId, string description, decimal price)
        {
            try
            {
                CarIssue issue = await _db.CarIssues.FirstOrDefaultAsync(i=>i.Id == IssueId);
                if(issue == null)
                {
                    return NotFound("Issue not found");
                }
                issue.Price = price;
                issue.Description = description;
                _db.Update(issue);
                _db.SaveChanges();
                return Ok("Issue edited");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return NotFound();
            }
        }

    }
}
