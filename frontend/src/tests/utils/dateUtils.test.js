import { padWithZero, timestampToDate, calculateDays} from "main/utils/dateUtils";


describe("dateUtils tests", () => {

  describe("padWithZero tests", () => {

    test("pads when less than 10", () => {
      expect(padWithZero(0)).toBe("00");
      expect(padWithZero(1)).toBe("01");
      expect(padWithZero(9)).toBe("09");

    });

    test("does not pad with 10 or greater", () => {
      expect(padWithZero(10)).toBe(10);
      expect(padWithZero(11)).toBe(11);
    });

  });

  describe("timestampToDate tests", () => {
    it("converts properly", () => {
      expect(timestampToDate(1653346250816)).toBe("2022-05-23");
    });
  });

  describe("calculateDays tests", () => {
    test("with mock current date 2023-06-01T00:00:00", () => {
      const startingDate = "2023-05-01T00:00:00";
      const currentDate = "2023-06-01T00:00:00";
      expect(calculateDays(startingDate,currentDate)).toBe(31);

    });
  });

});
