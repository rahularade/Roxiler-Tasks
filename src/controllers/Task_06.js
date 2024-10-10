import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import axios from "axios";
import { getMonthNumber } from "../constants.js";

const getCombinedData = asyncHandler(async (req, res) => {
  const { month } = req.query;

  if (!month || !getMonthNumber(month)) {
    return res.status(400).json({
      message: "Invalid month provided. Please use a valid month name.",
    });
  }

  try {
    // Prepare the Axios request options
    const requests = [
      axios.get(`${process.env.API_BASE_URL}/statistics?month=${month}`), // Adjust the URL as needed
      axios.get(`${process.env.API_BASE_URL}/barchart?month=${month}`),
      axios.get(`${process.env.API_BASE_URL}/piechart?month=${month}`),
    ];

    // Execute all requests concurrently
    const [statsResponse, barChartResponse, pieChartResponse] =
      await Promise.all(requests);

    // Extract data from responses
    const statistics = statsResponse.data.data || {};
    const barChart = barChartResponse.data.data || [];
    const pieChart = pieChartResponse.data.data || [];

    // Combine all responses into one JSON object
    const combinedResponse = {
      statistics,
      barChart,
      pieChart,
    };

    // Send the combined response
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          combinedResponse,
          "Combined data fetched successfully"
        )
      );
  } catch (error) {
    console.error("Error fetching combined data: ", error);
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          error.message || "Internal server error while fetching combined data"
        )
      );
  }
});

export { getCombinedData };
