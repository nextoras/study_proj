using System;
using System.Collections.Generic;
using System.Text;

namespace back_end
{
    public class InfoDTO
    {
        public List<InfoPartDTO> dayInfo { get; set;}
        public List<InfoPartDTO> weekInfo { get; set;}
        public string city { get; set; }

    }

    public class InfoPartDTO
    {
        public long dateTime {get;set;}
        public double temperature {get; set; }
        public double wind { get; set; }
        public double clouds { get; set; }
        public string description { get; set; }
        public string icon { get; set; }
        public string textFromKsu { get; set; }
        public double feels_like { get; set; }
        //string icon
        //textFromKsu
        //feels_like
        
    }
    
}