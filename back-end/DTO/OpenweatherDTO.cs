using System;
using System.Collections.Generic;
using System.Text;

namespace back_end
{
    public class OpenweatherDTO
    {
        List<OpenweatherInfoPartDTO> list { get; set;}

    }

    public class OpenweatherInfoPartDTO
    {
        public DateTime dt {get;set;}
        public MainInfo main {get; set; }
        public DescriptionInfo weather {get; set; }
        public double wind { get; set; }
        public CloudsInfo clouds { get; set; }
        public string city { get; set; }
        public string description { get; set; }
    }
    public class MainInfo
    {
        public double temp {get; set; }
        public double feels_like {get; set; }
    }

    public class DescriptionInfo
    {
        public string description {get; set; }
    }
    public class CloudsInfo
    {
        public long all {get; set; }
    }
}