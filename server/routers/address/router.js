const { express } = require("./../../packages");
const router = express.Router();
const {
  createRegion,
  updateRegion,
  deleteRegion,
  getRegions,
} = require("./region");
const {
  createDistrict,
  updateDistrict,
  deleteDistrict,
  getDistrictsByRegion,
  createDistricts,
} = require("./district");
const auth = require("./../../middleware/auth.middleware");

// Regions
router.post("/region/create", auth, createRegion);
router.put("/region/update", auth, updateRegion);
router.delete("/region/delete", deleteRegion);
router.get("/region/getall", getRegions);

// Districts
router.post("/district/create", auth, createDistrict);
router.put("/district/update", auth, updateDistrict);
router.delete("/district/delete", auth, deleteDistrict);
router.post("/district/getallbyregion", auth, getDistrictsByRegion);
router.post("/district/createall", auth, createDistricts);

module.exports = router;
