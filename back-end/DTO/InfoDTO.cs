using System;
using System.Collections.Generic;
using System.Text;

namespace back_end
{
    public class InfoDTO
    {
        public List<InfoPartDTO> dayInfo { get; set;}
        public List<InfoPartDTO> weekInfo { get; set;}

    }

    public class InfoPartDTO
    {
        public DateTime dateTime {get;set;}
        public double temperature {get; set; }
        public double wind { get; set; }
        public double clouds { get; set; }
        public string city { get; set; }
        public string description { get; set; }
        public void SetDate(string date)
        {
            dateTime = DateTime.ParseExact(date, "yyyy-MM-dd HH:mm:ss", System.Globalization.CultureInfo.InvariantCulture); 
        }
    }
    
}