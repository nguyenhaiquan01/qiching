using System.Globalization;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Text;
using System;

namespace VCTest
{
    
    
    /// <summary>
    ///This is a test class for VietnameseCalendarTestTest and is intended
    ///to contain all VietnameseCalendarTestTest Unit Tests
    ///</summary>
    [TestClass()]
    public class VietnameseCalendarTestTest
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
            VietnameseCalendarTest target = new VietnameseCalendarTest(); // TODO: Initialize to an appropriate value
            target.TwoDigitYearMax();
            Assert.Inconclusive("A method that does not return a value cannot be verified.");
        }

        /// <summary>
        ///A test for ToDateTime
        ///</summary>
        [TestMethod()]
        public void ToDateTimeTest()
        {
            VietnameseCalendarTest target = new VietnameseCalendarTest(); // TODO: Initialize to an appropriate value
            target.ToDateTime();
            Assert.Inconclusive("A method that does not return a value cannot be verified.");
        }

        /// <summary>
        ///A test for PrintHolidays
        ///</summary>
        [TestMethod()]
        public void PrintHolidaysTest()
        {
            VietnameseCalendarTest target = new VietnameseCalendarTest(); // TODO: Initialize to an appropriate value
            target.PrintHolidays();
            Assert.Inconclusive("A method that does not return a value cannot be verified.");
        }

        /// <summary>
        ///A test for PrintCurrentYear
        ///</summary>
        [TestMethod()]
        public void PrintCurrentYearTest()
        {
            VietnameseCalendarTest target = new VietnameseCalendarTest(); // TODO: Initialize to an appropriate value
            target.PrintCurrentYear();
            Assert.Inconclusive("A method that does not return a value cannot be verified.");
        }

        /// <summary>
        ///A test for PrintAllmostDays
        ///</summary>
        [TestMethod()]
        public void PrintAllmostDaysTest()
        {
            VietnameseCalendarTest target = new VietnameseCalendarTest(); // TODO: Initialize to an appropriate value
            target.PrintAllmostDays();
            Assert.Inconclusive("A method that does not return a value cannot be verified.");
        }

        /// <summary>
        ///A test for Initialize
        ///</summary>
        [TestMethod()]
        public void InitializeTest()
        {
            VietnameseCalendarTest target = new VietnameseCalendarTest(); // TODO: Initialize to an appropriate value
            target.Initialize();
            Assert.Inconclusive("A method that does not return a value cannot be verified.");
        }

        /// <summary>
        ///A test for FromDateTime
        ///</summary>
        [TestMethod()]
        public void FromDateTimeTest()
        {
            VietnameseCalendarTest target = new VietnameseCalendarTest(); // TODO: Initialize to an appropriate value
            target.FromDateTime();
            Assert.Inconclusive("A method that does not return a value cannot be verified.");
        }

        /// <summary>
        ///A test for CreateEvent
        ///</summary>
        [TestMethod()]
        [DeploymentItem("VietnameseCalendar.exe")]
        public void CreateEventTest()
        {
            StringBuilder buff = null; // TODO: Initialize to an appropriate value
            DateTime start = new DateTime(); // TODO: Initialize to an appropriate value
            int duration = 0; // TODO: Initialize to an appropriate value
            bool isPublic = false; // TODO: Initialize to an appropriate value
            string category = string.Empty; // TODO: Initialize to an appropriate value
            string summary = string.Empty; // TODO: Initialize to an appropriate value
            string description = string.Empty; // TODO: Initialize to an appropriate value
            VietnameseCalendarTest_Accessor.CreateEvent(buff, start, duration, isPublic, category, summary, description);
            Assert.Inconclusive("A method that does not return a value cannot be verified.");
        }

        /// <summary>
        ///A test for CheckLeapYear2006
        ///</summary>
        [TestMethod()]
        public void CheckLeapYear2006Test()
        {
            VietnameseCalendarTest target = new VietnameseCalendarTest(); // TODO: Initialize to an appropriate value
            target.CheckLeapYear2006();
            Assert.Inconclusive("A method that does not return a value cannot be verified.");
        }

        /// <summary>
        ///A test for VietnameseCalendarTest Constructor
        ///</summary>
        [TestMethod()]
        public void VietnameseCalendarTestConstructorTest()
        {
            VietnameseCalendarTest target = new VietnameseCalendarTest();
            Assert.Inconclusive("TODO: Implement code to verify target");
        }
    }
}
