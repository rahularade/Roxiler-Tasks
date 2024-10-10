import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";
import { getMonthNumber } from "../constants.js";

const getBarChart = asyncHandler(async (req, res) => {
  const { month } = req.query;

  if (!month || !getMonthNumber(month)) {
    return res.status(400).json({
      message: "Invalid month provided. Please use a valid month name.",
    });
  }

  const monthNumber = getMonthNumber(month);

  try {
    // Define the aggregation pipeline
    const barChartData = await Product.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, parseInt(monthNumber, 10)]
          }
        },
      },
      {
        $bucket: {
          groupBy: "$price", 
          boundaries: [0, 101, 201, 301, 401, 501, 601, 701, 801, 901, Infinity],
          default: "901-above",
          output: {
            count: { $sum: 1 } // Count the number of items in each range
          }
        }
      }
    ]);

    // Map the result to fit the format
    const formattedResult = barChartData.map((range) => {
      let rangeLabel;
      if (range._id === "901-above") {
        rangeLabel = "901-above";
      } else {
        const lowerBound = range._id;
        const upperBound = range._id + 99;
        rangeLabel = `${lowerBound} - ${upperBound}`;
      }
      return { priceRange: rangeLabel, count: range.count };
    });

    // Respond with the formatted bar chart data
    return res.status(200).json(new ApiResponse(200, formattedResult, "Bar chart data fetched successfully"));
      
  } catch (error) {
    return res.status(500).json(
      new ApiError(500, error.message || "Internal server error while fetching bar chart data")
    );
  }
});

export { getBarChart };