using System;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using back_end.Models;
using System.Net;
using Microsoft.Extensions.Configuration;

namespace back_end.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IConfiguration _configuration;

        public HomeController(ILogger<HomeController> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }
  
        [HttpPost]
        public IActionResult GetWeatherFromCity(string City)
        {
            string ApiKey = _configuration["ApiKey"];
            string url = string.Format("pro.openweathermap.org/data/2.5/forecast/hourly?q={0}&appid={1}", City, ApiKey);
            string content;
            var webClient = new WebClient();
           try
            {
                content = webClient.DownloadString(url);
                return Content(content);
            }
            catch
            {
                return Ok("Че-то пошло по пи*(город - пустой)");
            }


        }

        public IActionResult GetWeatherFromLatLen(string Flat, string Len)
        {
            string ApiKey = _configuration["ApiKey"];
            string url = string.Format("https://api.openweathermap.org/data/2.5/forecast?lat={0}&lon={1}&units=metric&appid={2}", Flat, Len, ApiKey);
            var webClient = new WebClient();
            try 
            {
                var content = webClient.DownloadString(url);
                return Content(content);
            }
            catch
            {
                return Ok("сервис ёкнулся (пришли пустые параметры lat & len)");
            }


        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
