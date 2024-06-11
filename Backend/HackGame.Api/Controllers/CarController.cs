using Microsoft.AspNetCore.Mvc;
using Mechanic.Api.Filters;
using Mechanic.Api.Data;
using Microsoft.EntityFrameworkCore;
using Mechanic.Api.Models;
using Mechanic.Api.TokenAuthorization;

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
                Role userRole = JwtAuthorization.GetUserRole(this.Request.Headers.Authorization!, _config);

                Car[] cars;
                if(userRole == Role.Admin)
                {
                    cars = await _db.Cars.Distinct().OrderBy(i => i.CreationTime).Reverse().Include(i=>i.Creator).Where(i => i.Make.Contains(make ?? "") && i.Model.Contains(model ?? "") && i.Plate.Contains(plate ?? "") && i.VinNumber.Contains(vin ?? "")).Skip(startingIndex * amount).Take(amount).ToArrayAsync();
                }
                else
                {
                    Guid userId = JwtAuthorization.GetUserId(this.Request.Headers.Authorization!, _config);
                    cars = await _db.Cars.Include(i=>i.Creator).Where(i => i.Creator.Id == userId && i.Make.Contains(make ?? "") && i.Model.Contains(model ?? "") && i.Plate.Contains(plate ?? "") && i.VinNumber.Contains(vin ?? "")).Skip(startingIndex * amount).Take(amount).Distinct().OrderBy(i => i.CreationTime).Reverse().ToArrayAsync();
                }
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
                Role userRole = JwtAuthorization.GetUserRole(this.Request.Headers.Authorization!, _config);
                Guid userId = JwtAuthorization.GetUserId(this.Request.Headers.Authorization!, _config);
                var car = await _db.Cars.Include(i=>i.Creator).FirstOrDefaultAsync(i => i.Id == carId);
                if(car == null)
                {
                    return NotFound();
                }
                if(car.Creator.Id == userId || userRole == Role.Admin)
                {
                    return Ok(car);
                }
                return Unauthorized();
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
                Role userRole = JwtAuthorization.GetUserRole(this.Request.Headers.Authorization!, _config);
                float pages;
                if(userRole == Role.Admin)
                {
                    pages = (float)_db.Cars.Where(i => i.Make.Contains(make) && i.Model.Contains(model.ToLower()) && i.Plate.Contains(plate) && i.VinNumber.Contains(vin)).Count() / (float)amountPrPage;
                }
                else
                {
                    Guid userId = JwtAuthorization.GetUserId(this.Request.Headers.Authorization!, _config);
                    pages = (float)_db.Cars.Where(i => i.Creator.Id == userId && i.Make.Contains(make) && i.Model.Contains(model.ToLower()) && i.Plate.Contains(plate) && i.VinNumber.Contains(vin)).Count() / (float)amountPrPage;
                }
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
        public async Task<IActionResult> CreateCar(string make, string model, string plate, string vinnr, string base64Image = "")
        {
            try
            {
                Guid userId = JwtAuthorization.GetUserId(HttpContext.Request.Headers.Authorization, _config);
                //if (_db.Cars.Where(i => i.Plate == plate || i.VinNumber == vinnr).Any()) {
                //    return BadRequest("Car Already exists check vin or plate");
                //}
                var user = await _db.Users.FirstOrDefaultAsync(i => i.Id == userId);
                if(user == null)
                {
                    return NotFound(Json("User not fount"));
                }

                Car car = new(user, vinnr, plate, make, model, base64Image);
                await _db.AddAsync(car);
                await _db.SaveChangesAsync();
                return Ok("Car created");
            }
            catch (Exception ex)
            {
                return StatusCode(500, Json("Something went wrong"));
            }
        }

        [JwtTokenAuthorization]
        [HttpDelete("DeleteIssue")]
        public async Task<IActionResult> DeleteIssue(Guid issueId)
        {
            try
            {

                Role userRole = JwtAuthorization.GetUserRole(this.Request.Headers.Authorization!, _config);
                int test;
                if(userRole == Role.Admin)
                {
                    test = await _db.CarIssues.Where(i => i.Id == issueId).ExecuteDeleteAsync();
                }
                else
                {
                    Guid userId = JwtAuthorization.GetUserId(this.Request.Headers.Authorization!, _config);
                    test = await _db.CarIssues.Where(i => i.Id == issueId && i.Creator.Id == userId).ExecuteDeleteAsync();
                }
                if(test == 1)
                {
                    return Ok(Json("Deletion successful"));
                }
                return Unauthorized();
            }
            catch (Exception ex)
            {
                return StatusCode(500, Json("Something went wrong"));
            }
        }

        [JwtTokenAuthorization]
        [HttpDelete("DeleteCar")]
        public async Task<IActionResult> DeleteCar(Guid carId)
        {
            try
            {
                Role userRole = JwtAuthorization.GetUserRole(this.Request.Headers.Authorization!, _config);
                Guid userId = JwtAuthorization.GetUserId(this.Request.Headers.Authorization!, _config);
                int i;
                if(userRole == Role.Admin)
                {
                    i = await _db.Cars.Where(i=>i.Id == carId).ExecuteDeleteAsync();
                }
                else
                {
                    i = await _db.Cars.Where(i=>i.Id == carId && i.Creator.Id == userId).ExecuteDeleteAsync();
                }
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
                Role userRole = JwtAuthorization.GetUserRole(this.Request.Headers.Authorization!, _config);
                Guid userId = JwtAuthorization.GetUserId(this.Request.Headers.Authorization!, _config);
                var issue = await _db.CarIssues.Include(i => i.Car).Include(i => i.Creator).Include(i => i.Category).FirstOrDefaultAsync(i => i.Id == issueId);
                if (issue == null)
                {
                    return NotFound("Issue not found");
                }
                if(userRole == Role.Admin || issue.Creator.Id == userId)
                {
                    return Ok(issue);
                }
                return Unauthorized("");

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
                Role userRole = JwtAuthorization.GetUserRole(this.Request.Headers.Authorization!, _config);
                CarIssue[] issues;
                if(userRole == Role.Admin)
                {
                    issues = await _db.CarIssues.Where(i=>i.Creator.Username.Contains(creatorName) && i.Car.Plate.Contains(plate) && i.Car.Make.Contains(make)).Skip(startingIndex * amount).Take(amount).ToArrayAsync();
                }
                else
                {
                    Guid userId = JwtAuthorization.GetUserId(this.Request.Headers.Authorization!, _config);
                    issues = await _db.CarIssues.Where(i=>i.Creator.Id == userId && i.Car.Plate.Contains(plate) && i.Car.Make.Contains(make)).Skip(startingIndex * amount).Take(amount).ToArrayAsync();
                }

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
                Guid userId = JwtAuthorization.GetUserId(this.Request.Headers.Authorization!, _config);
                Role userRole = JwtAuthorization.GetUserRole(this.Request.Headers.Authorization!, _config);
                CarIssue[] issues;
                if(userRole == Role.Admin)
                {
                    issues = await _db.CarIssues.Where(i=>i.Car.Id == carId).Skip(startingIndex).Take(amount).Include(x=>x.Creator).Distinct().OrderBy(I=>I.CreationTime).ToArrayAsync();
                }
                else
                {
                    issues = await _db.CarIssues.Where(i=>i.Car.Id == carId && i.Creator.Id == userId).Skip(startingIndex).Take(amount).Include(x=>x.Creator).Distinct().OrderBy(I=>I.CreationTime).ToArrayAsync();
                }
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
                Guid originUserId = JwtAuthorization.GetUserId(this.Request.Headers.Authorization!, _config);
                Role userRole = JwtAuthorization.GetUserRole(this.Request.Headers.Authorization!, _config);
                CarIssue[] issues;
                if(userRole == Role.Admin || userId == originUserId)
                {
                    issues = _db.CarIssues.Include(i => i.Creator).Where(i => i.Creator.Id == userId && i.Car.Make.Contains(make.ToLower()) && i.Car.Model.Contains(model.ToLower()) && i.Car.Plate.Contains(plate.ToLower()) && i.Car.VinNumber.Contains(vin.ToLower())).Skip(startingIndex).Take(amount).Distinct().OrderBy(I => I.CreationTime).ToArray();
                    return Ok(issues);
                }
                return Unauthorized();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, Json("something went wrong"));
            }
        }

        [JwtTokenAuthorization]
        [HttpPut("CreateCarIssue")]
        public async Task<IActionResult> CreateCarIssues(Guid carId, Guid categoryId, string description, decimal price)
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
                CarCategory? carCategory = await _db.CarCategories.FirstOrDefaultAsync(i => i.Id == categoryId);
                if(car == null)
                {
                    return NotFound("Car not found");
                }
                // if (carCategory == null)
                // {
                //     return NotFound("Category not found");
                // }

                CarIssue issue = new(carCategory, car, user, description, price);
                await _db.AddAsync(issue);
                await _db.SaveChangesAsync();
                return StatusCode(201, issue.Id);
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
                Guid userId = JwtAuthorization.GetUserId(this.Request.Headers.Authorization!, _config);
                Role userRole = JwtAuthorization.GetUserRole(this.Request.Headers.Authorization!, _config);
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
                Guid userId = JwtAuthorization.GetUserId(this.Request.Headers.Authorization!, _config);
                Role userRole = JwtAuthorization.GetUserRole(this.Request.Headers.Authorization!, _config);
                CarIssue issue = await _db.CarIssues.Include(i=>i.Creator).FirstOrDefaultAsync(i=>i.Id == IssueId);
                if(issue == null)
                {
                    return NotFound("Issue not found");
                }
                if(userRole != Role.Admin || issue.Creator.Id != userId)
                {
                    return Unauthorized();
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

        [JwtRoleAuthorization(Role.Admin)]
        [HttpPut("CreateCarIssueCategory")]
        public async Task<IActionResult> CreateCarIssueCategory(string tag)
        {
            try
            {
                Guid userId = JwtAuthorization.GetUserId(Request.Headers.Authorization, _config);

                var user = await _db.Users.FirstOrDefaultAsync(i => i.Id == userId);
                if (userId == null)
                {
                    return Unauthorized("User doesnt exist");
                }
                else if (user == null)
                {
                    return NotFound(Json("User not found"));
                }

                CarCategory carCategory = new(tag);
                await _db.AddAsync(carCategory);
                await _db.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, Json("Something went wrong"));
            }
        }


        [HttpGet("CarIssueCategories")]
        public async Task<IActionResult> GetCarIssueCategories()
        {
            try
            {
                Guid userId = JwtAuthorization.GetUserId(Request.Headers.Authorization, _config);

                var user = await _db.Users.FirstOrDefaultAsync(i => i.Id == userId);
                if (userId == null)
                {
                    return Unauthorized("User doesnt exist");
                }
                else if (user == null)
                {
                    return NotFound(Json("User not fount"));
                }
                CarCategory[] carCategories = await _db.CarCategories.ToArrayAsync(); 
                return Ok(carCategories);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, Json("Something went wrong"));
            }
        }

        [JwtRoleAuthorization(Role.Admin)]
        [HttpDelete("DeleteCarIssueCategory")]
        public async Task<IActionResult> DeleteCarIssueCategory(Guid categoryId)
        {
            try
            {
                var deleteResult = await _db.CarCategories.Where(i => i.Id == categoryId).ExecuteDeleteAsync();

                if (deleteResult == 1)
                {
                    return Ok(Json("Deletion Successful"));
                }
                else {
                    return NotFound(Json("Category not found"));
                }
            }
            catch (Exception)
            {
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

            var carCategories = new CarCategory[] {
                new("backlights"),
                new("frontlights"),
                new("breaks"),
                new("motor"),
            };
            await _db.AddRangeAsync(carCategories);
            int bobby = 0;
            int lilly = 0;
            foreach (var item in cars)
            {
                bobby++;
                System.Console.WriteLine(bobby);
                for (global::System.Int32 i = 0; i < 3; i++)
                {
                    lilly++;
                    System.Console.WriteLine(lilly);
                    var issues = new CarIssue[]{
                        new(carCategories[0], item, user, "nothing", 500),
                        new(carCategories[1], item, user, "nothing", 500),
                        new(carCategories[2], item, user, "nothing", 500),
                        new(carCategories[3], item, user, "nothing", 500),
                    };
                    await _db.AddRangeAsync(issues);
                }
            }

            await _db.SaveChangesAsync();
            return Ok();
        }

    }
}
