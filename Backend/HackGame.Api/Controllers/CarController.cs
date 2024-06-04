using Microsoft.AspNetCore.Mvc;
using Mechanic.Api.Filters;
using Mechanic.Api.Data;
using Microsoft.EntityFrameworkCore;
using Mechanic.Api.Models;
using Mechanic.Api.TokenAuthorization;
using Pomelo.EntityFrameworkCore.MySql.Query.Internal;
using Microsoft.Identity.Client;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Net.Http.Headers;

namespace Mechanic.Api.Controllers
{
    [Route("/cars")]
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
        public async Task<IActionResult> GetCars(int startingIndex, int amount, string make = "", string model = "", string plate = "", string vin = "")
        {
            try
            {
                var cars = _db.Cars.Where(i => i.Make.Contains(make ?? "") && i.Model.Contains(model ?? "") && i.Plate.Contains(plate ?? "") && i.VinNumber.Contains(vin ?? "")).Skip(startingIndex * amount).Take(amount).Distinct().OrderBy(i => i.CreationTime).ToArray();
                return Ok(cars);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, Json("Something went wrong"));
            }
        }

        [JwtTokenAuthorization]
        [HttpGet("GetCar")]
        public async Task<IActionResult> GetCar(Guid carId)
        {
            try
            {
                var car = await _db.Cars.FirstOrDefaultAsync(i => i.Id == carId);
                return Ok(car);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, Json("Something went wrong"));
            }
        }

        [JwtTokenAuthorization]
        [HttpGet("CarPages")]
        public async Task<IActionResult> CarPages(int amountPrPage, string make = "", string model = "", string plate = "", string vin = "")
        {
            try
            {
                float pages = (float)_db.Cars.Where(i => i.Make.Contains(make) && i.Model.Contains(model.ToLower()) && i.Plate.Contains(plate) && i.VinNumber.Contains(vin)).Count() / (float)amountPrPage;
                var amount = (int)MathF.Ceiling(pages);
                return Ok(amount);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, Json("Something went wrong"));
            }
        }

        [JwtTokenAuthorization]
        [HttpPut("CreateCar")]
        public async Task<IActionResult> CreateCar(string make, string model, string plate, string vinnr)
        {
            try
            {
                Guid userId = JwtAuthorization.GetUserId(HttpContext.Request.Headers.Authorization, _config);
                if (_db.Cars.Where(i => i.Plate == plate || i.VinNumber == vinnr).Any()) {
                    return BadRequest("Car Already exists check vin or plate");
                }
                var user = await _db.Users.FirstOrDefaultAsync(i => i.Id == userId);
                if(user == null)
                {
                    return NotFound(Json("User not fount"));
                }

                Car car = new(user, vinnr, plate, make, model);
                await _db.AddAsync(car);
                await _db.SaveChangesAsync();
                return Ok("Car created");
            }
            catch (Exception ex)
            {
                return StatusCode(500, Json("Something went wrong"));
            }
        }

        [JwtRoleAuthorization(Role.Admin)]
        [HttpDelete("DeleteIssue")]
        public async Task<IActionResult> DeleteIssue(Guid issueId)
        {
            try
            {
                var test = await _db.CarIssues.Where(i => i.Id == issueId).ExecuteDeleteAsync();
                Console.WriteLine(test);
                return Ok(Json("Deletion successful"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, Json("Something went wrong"));
            }
        }

        [JwtRoleAuthorization(new Role[]{Role.Admin})]
        [HttpDelete("DeleteCar")]
        public async Task<IActionResult> DeleteCar(Guid carId)
        {
            try
            {
                int i = await _db.Cars.Where(i=>i.Id == carId).ExecuteDeleteAsync();
                return Ok(Json("Deletion successful"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, Json("Something went wrong"));
            }
        }
        
        [JwtTokenAuthorization]
        [HttpGet("GetIssue")]
        public async Task<IActionResult> GetIssue(Guid issueId)
        {
            try
            {
                var issue = await _db.CarIssues
                .Include(i => i.Car) // Include related entities in the query result
                .Include(i => i.Creator)
                .FirstOrDefaultAsync(i => i.Id == issueId);

                if (issue == null)
                {
                    return NotFound("Issue not found");
                }

                return Ok(issue);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, Json("Something went wrong"));
            }
        }

        [JwtTokenAuthorization]
        [HttpGet("GetIssues")]
        public async Task<IActionResult> GetIssues(int startingIndex = 0, int amount = 0, string creatorName = "", string plate = "", string make = "")
        {
            try
            {
                var issues = await _db.CarIssues.Where(i=>i.Creator.Username.Contains(creatorName) && i.Car.Plate.Contains(plate) && i.Car.Make.Contains(make)).Skip(startingIndex * amount).Take(amount).ToArrayAsync();

                if (issues.Length <= 0)
                {
                    return NotFound("no issues found");
                }

                return Ok(issues);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, Json("Something went wrong"));
            }
        }

        [JwtTokenAuthorization]
        [HttpGet("CarIssues")]
        public async Task<IActionResult> GetCarIssues(Guid carId, int startingIndex = 0, int amount = 0)
        {
            try
            {
                CarIssue[] issues;
                issues = await _db.CarIssues.Where(i=>i.Car.Id == carId).Skip(startingIndex).Take(amount).Include(x=>x.Creator).Distinct().OrderBy(I=>I.CreationTime).ToArrayAsync();
                return Ok(issues);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, Json("something went wrong"));
            }
        }

        [JwtTokenAuthorization]
        [HttpGet("UserIssues")]
        public async Task<IActionResult> GetUserIssues(int startingIndex = 0, int amount = 0, Guid userId = new(), string make = "", string model = "", string plate = "", string vin = "")
        {
            try
            {
                CarIssue[] issues;
                issues = _db.CarIssues.Include(i => i.Creator).Where(i => i.Creator.Id == userId && i.Car.Make.Contains(make.ToLower()) && i.Car.Model.Contains(model.ToLower()) && i.Car.Plate.Contains(plate.ToLower()) && i.Car.VinNumber.Contains(vin.ToLower())).Skip(startingIndex).Take(amount).Distinct().OrderBy(I => I.CreationTime).ToArray();
                return Ok(issues);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, Json("something went wrong"));
            }
        }

        [JwtTokenAuthorization]
        [HttpPut("CreateCarIssue")]
        public async Task<IActionResult> CreateCarIssues(Guid carId, string description, decimal price)
        {
            try
            {
                Guid userId = JwtAuthorization.GetUserId(Request.Headers.Authorization, _config);

                var user = await _db.Users.FirstOrDefaultAsync(i => i.Id == userId);
                if(userId == null)
                {
                    return Unauthorized("User doesnt exist");
                }
                else if (user == null)
                {
                    return NotFound(Json("User not fount"));
                }

                Car car = await _db.Cars.FirstOrDefaultAsync(i=>i.Id == carId);
                if(car == null)
                {
                    return NotFound("Car not found");
                }
              
                CarIssue issue = new(car, user, description, price);
                await _db.AddAsync(issue);
                await _db.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, Json("Something went wrong"));
            }
        }

        [JwtTokenAuthorization]
        [HttpPut("UpdateCar")]
        public async Task<IActionResult> UpdateCar(Guid carId, string make, string model, string plate, string vinnr)
        {
            try
            {
                var car = await _db.Cars.Where(i => i.Id == carId).FirstOrDefaultAsync();
                if(car == null)
                {
                    return NotFound(Json("Car doesnt exist"));
                }
                car.Make = make;
                car.Model = model;
                car.Plate = plate;
                car.VinNumber = vinnr;
                return Ok(Json("Car updated"));
            }
            catch(Exception ex)
            {
                return StatusCode(500, Json("Something went wrong"));
            }
        }
 
        [JwtTokenAuthorization]
        [HttpPut("UpdateCarIssue")]
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
                return StatusCode(500, Json("Something went wrong"));
            }
        }

        [HttpPut("Debug fill database")]
        public async Task<IActionResult> DebugFill()
        {
            var user = await _db.Users.Where(i => i.Username == "admin").FirstOrDefaultAsync();
            if(user == null)
            {
                return BadRequest("not found");
            }
            var cars = new Car[] {
                new(user, "vin number", "plate", "volvo", "246"),
                new(user, "vin number", "plate", "volvo", "246"),
                new(user, "vin number", "plate", "volvo", "246"),
                new(user, "vin number", "plate", "volvo", "246"),
                new(user, "vin number", "plate", "volvo", "246"),
                new(user, "vin number", "plate", "volvo", "246"),
                new(user, "vin number", "plate", "volvo", "246"),
                new(user, "vin number", "plate", "volvo", "246"),
            };
            await _db.AddRangeAsync(cars);
            foreach (var item in cars)
            {
                for (global::System.Int32 i = 0; i < 3; i++)
                {
                    var issues = new CarIssue[]{
                        new(item, user, "nothing", 500),
                        new(item, user, "nothing", 500),
                        new(item, user, "nothing", 500),
                        new(item, user, "nothing", 500),
                    };
                    await _db.AddRangeAsync(issues);
                }
            }
            await _db.SaveChangesAsync();
            return Ok();
        }

    }
}
