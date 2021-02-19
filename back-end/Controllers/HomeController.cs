using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using back_end.Models;
using System.Web;
using Newtonsoft.Json;
using System.Net;


namespace back_end.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
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
        public JsonResult GetWeather(string City)
        {
            string ApiKey = "ae4b4e0ee9db8f4040b03a514cf7a928";
            string url =string.Format("http://api.openweathermap.org/data/2.5/weather?q={0}&appid={1}",City,ApiKey);
            var webClient = new WebClient();
            var content = webClient.DownloadString(url);
            object JsonWeather = JsonConvert.DeserializeObject(content);
            string ContentSerializble = JsonConvert.SerializeObject(JsonWeather);
            return Json(ContentSerializble);
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
