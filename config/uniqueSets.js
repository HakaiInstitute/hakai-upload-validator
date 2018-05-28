// These fields are unique together. Order matters here, if analyzing_lab
// doesn't exist, then the sample must be unique on its own.

// If two rows have same sample ID but neither have analyzing_lab then
// it should catch the duplicate

// NOTE: the first column in set is special. These rules apply to a row if the
// first column (eg hakai_id) is not null
const uniqueSets = [
  ["hakai_id", "analyzing_lab"],
  ["hakai_sample_id", "analyzing_lab"],
  ["ysi_hakai_id", "analyzing_lab"],
  ["event_id", "analyzing_lab"],
  ["ysi_calibration_hakai_id", "analyzing_lab"],
  ["non_filtered_preserved_sample_id", "analyzing_lab"],
  ["hakai_biomass_id", "analyzing_lab"],
  ["result_uid", "analyzing_lab"],
  ["solo_hakai_id", "analyzing_lab"],
  ["filter_no", "analyzing_lab"]
];

module.exports = uniqueSets;
