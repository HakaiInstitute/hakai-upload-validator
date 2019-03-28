/**
 * Determines xml namespace based on the metadata
 * @param {Object} metadata Metadata values
 */
const xmlnsFromMetadata = metadata => {
  const { data_type, program, project } = metadata;
  let xmlns;

  const dataTypeLower = data_type.toLowerCase();

  if (
    (program && program.toLowerCase() === "marinegeo") ||
    (project && project.toLowerCase() === "marinegeo") ||
    [
      "mg_clams",
      "mg_epiphytes",
      "mg_filtered_epiphytes",
      "mg_fish",
      "mg_inverts",
      "mg_macroalgae",
      "mg_mesograzers",
      "mg_seagrass_biomass",
      "mg_seagrass_density",
      "mg_seagrass_habitat",
    ].includes(dataTypeLower)
  ) {
    xmlns = "http://hakai.org/xforms/MARINEGEO_DATA";
  } else if (
    dataTypeLower === "secchi" ||
    dataTypeLower === "ctd" ||
    dataTypeLower === "ctd_drops"
  ) {
    xmlns = "http://hakai.org/xforms/CTD_DATA";
  } else if (dataTypeLower === "ctd_qc") {
    xmlns = "http://hakai.org/xforms/CTD_QC";
  } else if (dataTypeLower === "ysi_calibration") {
    xmlns = "http://hakai.org/xforms/YSI_CALIBRATION";
  } else {
    xmlns = "http://hakai.org/xforms/SAMPLING_DATA";
  }
  return xmlns;
};
module.exports = xmlnsFromMetadata;
