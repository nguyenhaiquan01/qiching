using System.Globalization;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Text;

namespace VCTest
{
    
    
    /// <summary>
    ///This is a test class for VietnameseCalendarTest and is intended
    ///to contain all VietnameseCalendarTest Unit Tests
    ///</summary>
    [TestClass()]
    public class VietnameseCalendarTest
    {


        private TestContext testContextInstance;

        /// <summary>
        ///Gets or sets the test context which provides
        ///information about and functionality for the current test run.
        ///</summary>
        public TestContext TestContext
        {
            get
            {
                return testContextInstance;
            }
            set
            {
                testContextInstance = value;
            }
        }

        #region Additional test attributes
        // 
        //You can use the following additional attributes as you write your tests:
        //
        //Use ClassInitialize to run code before running the first test in the class
        //[ClassInitialize()]
        //public static void MyClassInitialize(TestContext testContext)
        //{
        //}
        //
        //Use ClassCleanup to run code after all tests in a class have run
        //[ClassCleanup()]
        //public static void MyClassCleanup()
        //{
        //}
        //
        //Use TestInitialize to run code before running each test
        //[TestInitialize()]
        //public void MyTestInitialize()
        //{
        //}
        //
        //Use TestCleanup to run code after each test has run
        //[TestCleanup()]
        //public void MyTestCleanup()
        //{
        //}
        //
        #endregion


        /// <summary>
        ///A test for TwoDigitYearMax
        ///</summary>
        [TestMethod()]
        public void TwoDigitYearMaxTest()
        {
            VietnameseCalendar target = new VietnameseCalendar(); // TODO: Initialize to an appropriate value
            int expected = 0; // TODO: Initialize to an appropriate value
            int actual;
            target.TwoDigitYearMax = expected;
            actual = target.TwoDigitYearMax;
            Assert.AreEqual(expected, actual);
            Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for MinSupportedDateTime
        ///</summary>
        [TestMethod()]
        public void MinSupportedDateTimeTest()
        {
            VietnameseCalendar target = new VietnameseCalendar(); // TODO: Initialize to an appropriate value
            DateTime actual;
            actual = target.MinSupportedDateTime;
            Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for MinCalendarYear
        ///</summary>
        [TestMethod()]
        public void MinCalendarYearTest()
        {
            VietnameseCalendar target = new VietnameseCalendar(); // TODO: Initialize to an appropriate value
            int actual;
            actual = target.MinCalendarYear;
            Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for MaxSupportedDateTime
        ///</summary>
        [TestMethod()]
        public void MaxSupportedDateTimeTest()
        {
            VietnameseCalendar target = new VietnameseCalendar(); // TODO: Initialize to an appropriate value
            DateTime actual;
            actual = target.MaxSupportedDateTime;
            Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for MaxCalendarYear
        ///</summary>
        [TestMethod()]
        public void MaxCalendarYearTest()
        {
            VietnameseCalendar target = new VietnameseCalendar(); // TODO: Initialize to an appropriate value
            int actual;
            actual = target.MaxCalendarYear;
            Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for Eras
        ///</summary>
        [TestMethod()]
        public void ErasTest()
        {
            VietnameseCalendar target = new VietnameseCalendar(); // TODO: Initialize to an appropriate value
            int[] actual;
            actual = target.Eras;
            Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for AlgorithmType
        ///</summary>
        [TestMethod()]
        public void AlgorithmTypeTest()
        {
            VietnameseCalendar target = new VietnameseCalendar(); // TODO: Initialize to an appropriate value
            CalendarAlgorithmType actual;
            actual = target.AlgorithmType;
            Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for VerifyWritable
        ///</summary>
        [TestMethod()]
        public void VerifyWritableTest()
        {
            VietnameseCalendar target = new VietnameseCalendar(); // TODO: Initialize to an appropriate value
            target.VerifyWritable();
            Assert.Inconclusive("A method that does not return a value cannot be verified.");
        }

        /// <summary>
        ///A test for ToFourDigitYear
        ///</summary>
        [TestMethod()]
        public void ToFourDigitYearTest()
        {
            VietnameseCalendar target = new VietnameseCalendar(); // TODO: Initialize to an appropriate value
            int year = 0; // TODO: Initialize to an appropriate value
            int expected = 0; // TODO: Initialize to an appropriate value
            int actual;
            actual = target.ToFourDigitYear(year);
            Assert.AreEqual(expected, actual);
            Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for ToDateTime
        ///</summary>
        [TestMethod()]
        public void ToDateTimeTest()
        {
            VietnameseCalendar target = new VietnameseCalendar(); // TODO: Initialize to an appropriate value
            int year = 0; // TODO: Initialize to an appropriate value
            int month = 0; // TODO: Initialize to an appropriate value
            int day = 0; // TODO: Initialize to an appropriate value
            int hour = 0; // TODO: Initialize to an appropriate value
            int minute = 0; // TODO: Initialize to an appropriate value
            int second = 0; // TODO: Initialize to an appropriate value
            int millisecond = 0; // TODO: Initialize to an appropriate value
            int era = 0; // TODO: Initialize to an appropriate value
            DateTime expected = new DateTime(); // TODO: Initialize to an appropriate value
            DateTime actual;
            actual = target.ToDateTime(year, month, day, hour, minute, second, millisecond, era);
            Assert.AreEqual(expected, actual);
            Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for SunLongitude
        ///</summary>
        [TestMethod()]
        public void SunLongitudeTest()
        {
            DateTime time = new DateTime(); // TODO: Initialize to an appropriate value
            double expected = 0F; // TODO: Initialize to an appropriate value
            double actual;
            actual = VietnameseCalendar.SunLongitude(time);
            Assert.AreEqual(expected, actual);
            Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for JulianDayNumber
        ///</summary>
        [TestMethod()]
        public void JulianDayNumberTest()
        {
            DateTime time = new DateTime(); // TODO: Initialize to an appropriate value
            double expected = 0F; // TODO: Initialize to an appropriate value
            double actual;
            actual = VietnameseCalendar.JulianDayNumber(time);
            Assert.AreEqual(expected, actual);
            Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for IsLeapYear
        ///</summary>
        [TestMethod()]
        public void IsLeapYearTest()
        {
            VietnameseCalendar target = new VietnameseCalendar(); // TODO: Initialize to an appropriate value
            int year = 0; // TODO: Initialize to an appropriate value
            int era = 0; // TODO: Initialize to an appropriate value
            bool expected = false; // TODO: Initialize to an appropriate value
            bool actual;
            actual = target.IsLeapYear(year, era);
            Assert.AreEqual(expected, actual);
            Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for IsLeapMonth
        ///</summary>
        [TestMethod()]
        public void IsLeapMonthTest()
        {
            VietnameseCalendar target = new VietnameseCalendar(); // TODO: Initialize to an appropriate value
            int year = 0; // TODO: Initialize to an appropriate value
            int month = 0; // TODO: Initialize to an appropriate value
            int era = 0; // TODO: Initialize to an appropriate value
            bool expected = false; // TODO: Initialize to an appropriate value
            bool actual;
            actual = target.IsLeapMonth(year, month, era);
            Assert.AreEqual(expected, actual);
            Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for IsLeapDay
        ///</summary>
        [TestMethod()]
        public void IsLeapDayTest()
        {
            VietnameseCalendar target = new VietnameseCalendar(); // TODO: Initialize to an appropriate value
            int year = 0; // TODO: Initialize to an appropriate value
            int month = 0; // TODO: Initialize to an appropriate value
            int day = 0; // TODO: Initialize to an appropriate value
            int era = 0; // TODO: Initialize to an appropriate value
            bool expected = false; // TODO: Initialize to an appropriate value
            bool actual;
            actual = target.IsLeapDay(year, month, day, era);
            Assert.AreEqual(expected, actual);
            Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for GetYearName
        ///</summary>
        [TestMethod()]
        public void GetYearNameTest()
        {
            VietnameseCalendar target = new VietnameseCalendar(); // TODO: Initialize to an appropriate value
            int year = 0; // TODO: Initialize to an appropriate value
            string expected = string.Empty; // TODO: Initialize to an appropriate value
            string actual;
            actual = target.GetYearName(year);
            Assert.AreEqual(expected, actual);
            Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for GetYearCode
        ///</summary>
        [TestMethod()]
        [DeploymentItem("VietnameseCalendar.exe")]
        public void GetYearCodeTest()
        {
            int year = 0; // TODO: Initialize to an appropriate value
            int expected = 0; // TODO: Initialize to an appropriate value
            int actual;
            actual = VietnameseCalendar_Accessor.GetYearCode(year);
            Assert.AreEqual(expected, actual);
            Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for GetYear
        ///</summary>
        [TestMethod()]
        public void GetYearTest()
        {
            VietnameseCalendar target = new VietnameseCalendar(); // TODO: Initialize to an appropriate value
            DateTime time = new DateTime(); // TODO: Initialize to an appropriate value
            int expected = 0; // TODO: Initialize to an appropriate value
            int actual;
            actual = target.GetYear(time);
            Assert.AreEqual(expected, actual);
            Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for GetTwoDigitYearMax
        ///</summary>
        [TestMethod()]
        public void GetTwoDigitYearMaxTest()
        {
            int calendarId = 0; // TODO: Initialize to an appropriate value
            int expected = 0; // TODO: Initialize to an appropriate value
            int actual;
            actual = VietnameseCalendar.GetTwoDigitYearMax(calendarId);
            Assert.AreEqual(expected, actual);
            Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for GetSystemTwoDigitYearSetting
        ///</summary>
        [TestMethod()]
        public void GetSystemTwoDigitYearSettingTest()
        {
            int calendarId = 0; // TODO: Initialize to an appropriate value
            int defaultYearValue = 0; // TODO: Initialize to an appropriate value
            int expected = 0; // TODO: Initialize to an appropriate value
            int actual;
            actual = VietnameseCalendar.GetSystemTwoDigitYearSetting(calendarId, defaultYearValue);
            Assert.AreEqual(expected, actual);
            Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for GetPropitiousHour
        ///</summary>
        [TestMethod()]
        public void GetPropitiousHourTest()
        {
            VietnameseCalendar target = new VietnameseCalendar(); // TODO: Initialize to an appropriate value
            DateTime date = new DateTime(); // TODO: Initialize to an appropriate value
            string expected = string.Empty; // TODO: Initialize to an appropriate value
            string actual;
            actual = target.GetPropitiousHour(date);
            Assert.AreEqual(expected, actual);
            Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for GetMonthsInYear
        ///</summary>
        [TestMethod()]
        public void GetMonthsInYearTest()
        {
            VietnameseCalendar target = new VietnameseCalendar(); // TODO: Initialize to an appropriate value
            int year = 0; // TODO: Initialize to an appropriate value
            int era = 0; // TODO: Initialize to an appropriate value
            int expected = 0; // TODO: Initialize to an appropriate value
            int actual;
            actual = target.GetMonthsInYear(year, era);
            Assert.AreEqual(expected, actual);
            Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for GetMonthName
        ///</summary>
        [TestMethod()]
        public void GetMonthNameTest()
        {
            VietnameseCalendar target = new VietnameseCalendar(); // TODO: Initialize to an appropriate value
            int year = 0; // TODO: Initialize to an appropriate value
            int month = 0; // TODO: Initialize to an appropriate value
            string expected = string.Empty; // TODO: Initialize to an appropriate value
            string actual;
            actual = target.GetMonthName(year, month);
            Assert.AreEqual(expected, actual);
            Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for GetMonthLength
        ///</summary>
        [TestMethod()]
        [DeploymentItem("VietnameseCalendar.exe")]
        public void GetMonthLengthTest()
        {
            int year = 0; // TODO: Initialize to an appropriate value
            int month = 0; // TODO: Initialize to an appropriate value
            int leapMonth = 0; // TODO: Initialize to an appropriate value
            int expected = 0; // TODO: Initialize to an appropriate value
            int actual;
            actual = VietnameseCalendar_Accessor.GetMonthLength(year, month, leapMonth);
            Assert.AreEqual(expected, actual);
            Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for GetMonth
        ///</summary>
        [TestMethod()]
        public void GetMonthTest()
        {
            VietnameseCalendar target = new VietnameseCalendar(); // TODO: Initialize to an appropriate value
            DateTime time = new DateTime(); // TODO: Initialize to an appropriate value
            int expected = 0; // TODO: Initialize to an appropriate value
            int actual;
            actual = target.GetMonth(time);
            Assert.AreEqual(expected, actual);
            Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for GetMinorSolarTerms
        ///</summary>
        [TestMethod()]
        public void GetMinorSolarTermsTest()
        {
            VietnameseCalendar target = new VietnameseCalendar(); // TODO: Initialize to an appropriate value
            DateTime date = new DateTime(); // TODO: Initialize to an appropriate value
            string expected = string.Empty; // TODO: Initialize to an appropriate value
            string actual;
            actual = target.GetMinorSolarTerms(date);
            Assert.AreEqual(expected, actual);
            Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for GetLunarNewYear
        ///</summary>
        [TestMethod()]
        [DeploymentItem("VietnameseCalendar.exe")]
        public void GetLunarNewYearTest()
        {
            int year = 0; // TODO: Initialize to an appropriate value
            DateTime expected = new DateTime(); // TODO: Initialize to an appropriate value
            DateTime actual;
            actual = VietnameseCalendar_Accessor.GetLunarNewYear(year);
            Assert.AreEqual(expected, actual);
            Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for GetLeapMonth
        ///</summary>
        [TestMethod()]
        public void GetLeapMonthTest()
        {
            VietnameseCalendar target = new VietnameseCalendar(); // TODO: Initialize to an appropriate value
            int year = 0; // TODO: Initialize to an appropriate value
            int era = 0; // TODO: Initialize to an appropriate value
            int expected = 0; // TODO: Initialize to an appropriate value
            int actual;
            actual = target.GetLeapMonth(year, era);
            Assert.AreEqual(expected, actual);
            Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for GetHourZeroName
        ///</summary>
        [TestMethod()]
        public void GetHourZeroNameTest()
        {
            VietnameseCalendar target = new VietnameseCalendar(); // TODO: Initialize to an appropriate value
            DateTime time = new DateTime(); // TODO: Initialize to an appropriate value
            string expected = string.Empty; // TODO: Initialize to an appropriate value
            string actual;
            actual = target.GetHourZeroName(time);
            Assert.AreEqual(expected, actual);
            Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for GetEra
        ///</summary>
        [TestMethod()]
        public void GetEraTest()
        {
            VietnameseCalendar target = new VietnameseCalendar(); // TODO: Initialize to an appropriate value
            DateTime time = new DateTime(); // TODO: Initialize to an appropriate value
            int expected = 0; // TODO: Initialize to an appropriate value
            int actual;
            actual = target.GetEra(time);
            Assert.AreEqual(expected, actual);
            Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for GetDaysInYear
        ///</summary>
        [TestMethod()]
        public void GetDaysInYearTest()
        {
            VietnameseCalendar target = new VietnameseCalendar(); // TODO: Initialize to an appropriate value
            int year = 0; // TODO: Initialize to an appropriate value
            int era = 0; // TODO: Initialize to an appropriate value
            int expected = 0; // TODO: Initialize to an appropriate value
            int actual;
            actual = target.GetDaysInYear(year, era);
            Assert.AreEqual(expected, actual);
            Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for GetDaysInMonth
        ///</summary>
        [TestMethod()]
        public void GetDaysInMonthTest()
        {
            VietnameseCalendar target = new VietnameseCalendar(); // TODO: Initialize to an appropriate value
            int year = 0; // TODO: Initialize to an appropriate value
            int month = 0; // TODO: Initialize to an appropriate value
            int era = 0; // TODO: Initialize to an appropriate value
            int expected = 0; // TODO: Initialize to an appropriate value
            int actual;
            actual = target.GetDaysInMonth(year, month, era);
            Assert.AreEqual(expected, actual);
            Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for GetDayOfYear
        ///</summary>
        [TestMethod()]
        public void GetDayOfYearTest()
        {
            VietnameseCalendar target = new VietnameseCalendar(); // TODO: Initialize to an appropriate value
            DateTime time = new DateTime(); // TODO: Initialize to an appropriate value
            int expected = 0; // TODO: Initialize to an appropriate value
            int actual;
            actual = target.GetDayOfYear(time);
            Assert.AreEqual(expected, actual);
            Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for GetDayOfWeek
        ///</summary>
        [TestMethod()]
        public void GetDayOfWeekTest()
        {
            VietnameseCalendar target = new VietnameseCalendar(); // TODO: Initialize to an appropriate value
            DateTime time = new DateTime(); // TODO: Initialize to an appropriate value
            DayOfWeek expected = new DayOfWeek(); // TODO: Initialize to an appropriate value
            DayOfWeek actual;
            actual = target.GetDayOfWeek(time);
            Assert.AreEqual(expected, actual);
            Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for GetDayOfMonth
        ///</summary>
        [TestMethod()]
        public void GetDayOfMonthTest()
        {
            VietnameseCalendar target = new VietnameseCalendar(); // TODO: Initialize to an appropriate value
            DateTime time = new DateTime(); // TODO: Initialize to an appropriate value
            int expected = 0; // TODO: Initialize to an appropriate value
            int actual;
            actual = target.GetDayOfMonth(time);
            Assert.AreEqual(expected, actual);
            Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for GetDayName
        ///</summary>
        [TestMethod()]
        public void GetDayNameTest()
        {
            VietnameseCalendar target = new VietnameseCalendar(); // TODO: Initialize to an appropriate value
            DateTime date = new DateTime(); // TODO: Initialize to an appropriate value
            string expected = string.Empty; // TODO: Initialize to an appropriate value
            string actual;
            actual = target.GetDayName(date);
            Assert.AreEqual(expected, actual);
            Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for GetCalendarInfo
        ///</summary>
        [TestMethod()]
        public void GetCalendarInfoTest()
        {
            int localeId = 0; // TODO: Initialize to an appropriate value
            int calendarId = 0; // TODO: Initialize to an appropriate value
            int calendarType = 0; // TODO: Initialize to an appropriate value
            StringBuilder data = null; // TODO: Initialize to an appropriate value
            int dataSize = 0; // TODO: Initialize to an appropriate value
            int value = 0; // TODO: Initialize to an appropriate value
            int valueExpected = 0; // TODO: Initialize to an appropriate value
            int expected = 0; // TODO: Initialize to an appropriate value
            int actual;
            actual = VietnameseCalendar.GetCalendarInfo(localeId, calendarId, calendarType, data, dataSize, ref value);
            Assert.AreEqual(valueExpected, value);
            Assert.AreEqual(expected, actual);
            Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for FromDateTime
        ///</summary>
        [TestMethod()]
        public void FromDateTimeTest()
        {
            VietnameseCalendar target = new VietnameseCalendar(); // TODO: Initialize to an appropriate value
            DateTime time = new DateTime(); // TODO: Initialize to an appropriate value
            int year = 0; // TODO: Initialize to an appropriate value
            int yearExpected = 0; // TODO: Initialize to an appropriate value
            int month = 0; // TODO: Initialize to an appropriate value
            int monthExpected = 0; // TODO: Initialize to an appropriate value
            int day = 0; // TODO: Initialize to an appropriate value
            int dayExpected = 0; // TODO: Initialize to an appropriate value
            target.FromDateTime(time, out year, out month, out day);
            Assert.AreEqual(yearExpected, year);
            Assert.AreEqual(monthExpected, month);
            Assert.AreEqual(dayExpected, day);
            Assert.Inconclusive("A method that does not return a value cannot be verified.");
        }

        /// <summary>
        ///A test for CheckYearRange
        ///</summary>
        [TestMethod()]
        public void CheckYearRangeTest()
        {
            VietnameseCalendar target = new VietnameseCalendar(); // TODO: Initialize to an appropriate value
            int year = 0; // TODO: Initialize to an appropriate value
            target.CheckYearRange(year);
            Assert.Inconclusive("A method that does not return a value cannot be verified.");
        }

        /// <summary>
        ///A test for CheckTicksRange
        ///</summary>
        [TestMethod()]
        public void CheckTicksRangeTest()
        {
            VietnameseCalendar target = new VietnameseCalendar(); // TODO: Initialize to an appropriate value
            long ticks = 0; // TODO: Initialize to an appropriate value
            target.CheckTicksRange(ticks);
            Assert.Inconclusive("A method that does not return a value cannot be verified.");
        }

        /// <summary>
        ///A test for CheckMonthRange
        ///</summary>
        [TestMethod()]
        public void CheckMonthRangeTest()
        {
            VietnameseCalendar target = new VietnameseCalendar(); // TODO: Initialize to an appropriate value
            int month = 0; // TODO: Initialize to an appropriate value
            int leapMonth = 0; // TODO: Initialize to an appropriate value
            target.CheckMonthRange(month, leapMonth);
            Assert.Inconclusive("A method that does not return a value cannot be verified.");
        }

        /// <summary>
        ///A test for CheckEraRange
        ///</summary>
        [TestMethod()]
        public void CheckEraRangeTest()
        {
            VietnameseCalendar target = new VietnameseCalendar(); // TODO: Initialize to an appropriate value
            int era = 0; // TODO: Initialize to an appropriate value
            target.CheckEraRange(era);
            Assert.Inconclusive("A method that does not return a value cannot be verified.");
        }

        /// <summary>
        ///A test for AddYears
        ///</summary>
        [TestMethod()]
        public void AddYearsTest()
        {
            VietnameseCalendar target = new VietnameseCalendar(); // TODO: Initialize to an appropriate value
            DateTime time = new DateTime(); // TODO: Initialize to an appropriate value
            int years = 0; // TODO: Initialize to an appropriate value
            DateTime expected = new DateTime(); // TODO: Initialize to an appropriate value
            DateTime actual;
            actual = target.AddYears(time, years);
            Assert.AreEqual(expected, actual);
            Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for AddMonths
        ///</summary>
        [TestMethod()]
        public void AddMonthsTest()
        {
            VietnameseCalendar target = new VietnameseCalendar(); // TODO: Initialize to an appropriate value
            DateTime time = new DateTime(); // TODO: Initialize to an appropriate value
            int months = 0; // TODO: Initialize to an appropriate value
            DateTime expected = new DateTime(); // TODO: Initialize to an appropriate value
            DateTime actual;
            actual = target.AddMonths(time, months);
            Assert.AreEqual(expected, actual);
            Assert.Inconclusive("Verify the correctness of this test method.");
        }

        /// <summary>
        ///A test for VietnameseCalendar Constructor
        ///</summary>
        [TestMethod()]
        public void VietnameseCalendarConstructorTest()
        {
            VietnameseCalendar target = new VietnameseCalendar();
            Assert.Inconclusive("TODO: Implement code to verify target");
        }
    }
}
