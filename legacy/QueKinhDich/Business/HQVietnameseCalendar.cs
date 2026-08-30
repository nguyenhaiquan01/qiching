using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace System.Globalization
{
    class HQVietnameseCalendar : VietnameseCalendar
    {
        /// <summary>
        /// Can cua gio Chinh Ty (00:00) cua ngay voi JDN nay.
        /// </summary>
        //public virtual string GetHourName(DateTime time)
        //{
        //    int jdn = (int)Math.Floor(JulianDayNumber(time));
        //    return selestialStems[(jdn - 1) * 2 % 10] + " " + terrestrialBranches[0];
        //} 

        /// <summary>
        /// Find next available day
        /// </summary>
        /// <param name="year"></param>
        /// <param name="month"></param>
        /// <param name="day"></param>
        static public void NextAvailableDate(ref int year,ref int month,ref int day)
        {
            if (month==12)
            {
                if (day==31)
                {
                    year = year + 1;
                    month = 1;
                    day = 1;
                }
                else
                    day=day+1;
            }
            else
                if ((month == 1) || (month == 3) || (month == 5) || (month == 7) || (month == 8) || (month == 10))
                {
                    if (day == 31)
                    {
                        day = 1;
                        month++;
                    }
                    else
                        day++;
                }
                else
                    if (month != 2)
                    {
                        if (day == 30)
                        {
                            day = 1;
                            month++;
                        }
                        else day++;
                    }
                    else
                    {
                        if ((year % 4 == 0) && (day == 29))
                        {
                            day = 1;
                            month++;
                        }
                        else
                            if ((year % 4 != 0) && (day == 28))
                            {
                                day = 1;
                                month++;
                            }
                            else
                                day++;
                    }

        }        
    }
}
