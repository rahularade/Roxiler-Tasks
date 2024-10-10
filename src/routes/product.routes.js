import { Router } from "express";
import { initilizeProduct } from "../controllers/Task_01.js";
import { getProducts } from "../controllers/Task_02.js";
import { getStatistics } from "../controllers/Task_03.js";
import { getBarChart } from "../controllers/Task_04.js";
import { getPieChart } from "../controllers/Task_05.js";
import { getCombinedData } from "../controllers/Task_06.js";

const router = Router();

router.route("/initialize").get(initilizeProduct)
router.route("/").get(getProducts)
router.route('/statistics').get(getStatistics)
router.route('/barchart').get(getBarChart)
router.route('/piechart').get(getPieChart)
router.route('/combinedData').get(getCombinedData)

export default router;