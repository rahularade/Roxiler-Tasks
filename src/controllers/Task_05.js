import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";
import { getMonthNumber } from "../constants.js";

const getPieChart = asyncHandler(async (req, res) => {
  const { month } = req.query;

  if (!month || !getMonthNumber(month)) {
    return res.status(400).json({
      message: "Invalid month provided. Please use a valid month name.",
    });
  }

  const monthNumber = getMonthNumber(month);

  try {
    // Define the aggregation pipeline
    const pieChartData = await Product.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, parseInt(monthNumber, 10)],
          },
        },
      },
      {
        $group: {
          _id: "$category", 
          itemCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          itemCount: 1,
        },
      },
    ]);


    return res
      .status(200)
      .json(new ApiResponse(200, pieChartData, "Pie chart data fetched successfully"));
  } catch (error) {
    return res.status(500).json(
      new ApiError(500, error.message || "Internal server error while fetching pie chart data")
    );
  }
});

export { getPieChart };
