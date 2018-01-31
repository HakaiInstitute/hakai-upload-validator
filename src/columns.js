const Joi = require("joi-browser");

const defaultHeaders = {
  _joiobj: Joi.object().and("date", "site_id", "sampling_bout"),
  action: {},
  uid: {
    matches: ["suva_uid", "doc_uid", "do13c_uid", "nutrient_uid"]
  },
  event_pk: {
    joi: Joi.number().integer()
  },
  date: {
    output: "Date",
    level: 1,
    joi: Joi.alternatives().try(Joi.number(), Joi.date().max("now"))
  },
  organization: {
    level: 1
  },
  project: {
    level: 1
  },
  survey: {
    output: "Survey",
    level: 1,
    matches: ["Survey type", "Cruise"],
    joi: Joi.string()
  },
  sampling_bout: {
    output: "Sampling_Bout",
    level: 1,
    matches: ["Drop"],
    joi: Joi.number().integer()
  },
  watershed: {
    output: "Watershed_ID",
    level: 1,
    matches: ["Watershed ID"],
    joi: Joi.string()
  },
  site_id: {
    output: "Site_ID",
    level: 1,
    matches: ["Station", "Site"],
    joi: Joi.string()
  },
  source: {
    level: 1,
    matches: ["Freshwater/Marine", "FRESH/MARINE"],
    joi: Joi.string()
      .valid(["Freshwater", "Marine", "F", "M"])
      .insensitive()
  },
  location: {
    output: "Work_Area",
    level: 1,
    matches: ["Work Area", "Work_Area"],
    joi: Joi.string()
  },
  gather_location: {
    output: "Gather_Location",
    level: 1
  },
  gather_lat: {
    output: "Gather_Lat",
    level: 1
  },
  gather_log: {
    output: "Gather_Long",
    level: 1
  },
  lat: {
    output: "latitude",
    level: 1,
    drop: true
  },
  long: {
    output: "longitude",
    level: 1,
    drop: true
  },
  vessel: {
    output: "Vessel",
    level: 1
  },
  lims_id: {
    matches: ["LIMS Sample ID"]
  },
  project_id: {
    output: "sample_id_other",
    matches: ["Project Specific ID", "project_sample_id"],
    joi: Joi.string()
      .invalid(["na", "nd", "n/d", "n/a"])
      .insensitive()
  },
  hakai_id: {
    output: "_1__Sample_ID",
    matches: ["Hakai ID", "Tube number", "Sample ID"],
    joi: Joi.string()
      .regex(/^[\w\d._-]+$/)
      .min(3)
      .invalid(["na", "nd", "n/d", "n/a"])
      .insensitive()
  },
  depth: {
    output: "Depth",
    matches: [
      "Depth (m)",
      "sample depth",
      "Bottom Depth",
      "Line Out Depth",
      "Line Out Depth Range"
    ],
    joi: Joi.alternatives([
      Joi.string().regex(/^\d+-\d+$/, { name: "Depth Range" }),
      Joi.number().min(0)
    ])
  },
  pressure_transducer_depth: {
    output: "Pressure_Transducer_Depth__m_",
    matches: ["Pressure_Transducer_Depth__m_", "Pressure Transducer Depth (m)"],
    joi: Joi.number().min(0)
  },
  surveyors: {
    output: "Field_Technician_s_",
    level: 1,
    matches: ["Surveyor(s)", "Field Technician", "Field Staff"],
    joi: Joi.string().regex(/^[a-zA-Z]+.?[a-zA-Z]+/)
  },
  lab_technicians: {
    output: "Lab_Technician_s_",
    level: 1,
    matches: ["Data Entry by:", "Lab_Technician_s_", "Lab Technician"],
    joi: Joi.string().regex(/^[a-zA-Z]+.?[a-zA-Z]+/)
  },
  rep_site: {
    output: "Random_site_for_replicates_",
    level: 1,
    matches: ["Randomly selected site for replicates"]
  },
  precip: {
    output: "Precipitation_comments_",
    level: 1,
    matches: ["Precipitation comments"]
  },
  site_notes: {
    output: "Notes",
    matches: ["Notes for this site"]
  },
  sample_notes: {
    output: "Sample_Notes",
    matches: ["Comments", "comments", "comment"]
  },
  note_all: {
    output: "notes_all",
    level: 1,
    matches: ["Notes for all sites", "notes_for_all_sites"]
  },
  water_stage: {
    output: "Water_Stage__cm_",
    level: 1,
    matches: ["Water Stage (cm)"],
    joi: Joi.number()
  },
  water_stage_flag: {
    level: 1
  },
  collected: {
    matches: ["collected", "Field Time", "Time", "YSI Time"],
    joi: Joi.alternatives().try(Joi.number(), Joi.date().max("now"))
  },
  preserved: {
    matches: ["preserved", "Lab Time"],
    joi: Joi.alternatives().try(Joi.number(), Joi.date().max("now"))
  },
  analyzed: {
    matches: ["analyzed", "Analyzed Date"],
    joi: Joi.alternatives().try(Joi.number(), Joi.date().max("now"))
  },
  analyzing_lab: {
    matches: ["Analyzing Lab", "Analyzing lab"],
    joi: Joi.string()
      .alphanum()
      .invalid(["na", "nd", "n/d", "n/a"])
      .insensitive()
  },
  row_flag: {
    matches: ["Row Flag", "QC flags", "Sample Status"]
  },
  quality_level: {
    matches: ["Quality Level", "Quality_Level"]
  },
  flag_code: {
    matches: ["Flag - Code"]
  },
  flag_error_explanation: {
    matches: ["Flag - Explanation"]
  },
  flag_resolved_explanation: {
    matches: ["Flag - Explain how it was resolved"]
  },
  flag_resolved: {
    matches: [
      "Flag - Has the value been edited or verified? i.e., is this resolved? (Y/N)"
    ]
  },
  qc_notes: {
    matches: ["QC Comments", "QC Notes"]
  },
  collection_method: {
    output: "Sample_Type",
    matches: ["Collection Method"]
  },
  quality_log: {
    output: "Quality Log"
  },
  replicate_number: {
    output: "Replicate Number"
  },
  no: {},
  date_exported: {
    output: "Date Exported"
  },
  applied_filters: {
    output: "Applied Filters",
    matches: ["Applied Filters"]
  },
  fields: {
    output: "Fields"
  },
  flag: {
    output: "Flag",
    matches: ["Flags"]
  }
};

const defaultMetadata = {
  ...defaultHeaders,
  ...{
    data_type: {},
    program: {
      matches: ["Program name"]
    },
    project: {
      matches: ["project name"]
    },
    source: {},
    analyzing_lab: {},
    sampling_location: {},
    sampling_method: {}
  }
};

const defaultFilters = {
  ...defaultHeaders,
  ...{
    _joiobj: defaultHeaders._joiobj,
    weight_before: {
      matches: ["Weight Before (mg)", "pre_weight_mg"],
      joi: Joi.number()
    },
    weight_after: {
      matches: ["Weight After (mg)", "post_weight_mg"],
      joi: Joi.number()
    },
    weight_before_flag: {
      matches: ["Weight Before Flag", "pre_weight_flag"],
      joi: Joi.string()
    },
    weight_after_flag: {
      matches: ["Weight After Flag", "post_weight_flag"],
      joi: Joi.string()
    },
    filter_no: {
      output: "_1__Filter_No_",
      matches: [
        "Pre-weighed Filter #",
        "Tube Number",
        "Filter #",
        "filter_id",
        "Sample ID",
        "Hakai ID"
      ],
      joi: Joi.alternatives().try(
        Joi.number(),
        Joi.string()
          .regex(/^[\w\d_-]+$/)
          .min(3)
          .invalid(["na", "nd", "n/d", "n/a"])
          .insensitive()
      )
    },
    filter_wet_weight: {
      output: "_1__Wet_Weight",
      matches: ["filter_wet_weight", "filter wet weight"],
      joi: Joi.number()
    },
    filter_type: {
      output: "Filter_Type",
      matches: ["filter_type", "Filter Type"]
    },
    filter_size_mm: {
      output: "filter_size",
      matches: ["filter_size_mm", "Filter Size (mm)"],
      joi: Joi.number()
    },
    volume: {
      output: "_1__Volume",
      matches: ["Volume", "Volume (ml)", "volume_ml", "volume filtered"],
      joi: Joi.number()
    },
    filter_portion: {
      joi: Joi.number()
    },
    acid_filter: {
      output: "_1__Acidified",
      matches: [
        "Acidified",
        "Acidified at time of filtration",
        "Acidified at time of filtration A"
      ]
    }
  }
};

const defaultZooplanktonHeaders = {
  ...defaultFilters,
  ...{
    _joiobj: defaultFilters._joiobj.concat(
      Joi.object()
        .and("flow_meter", "flow_in", "flow_out")
        .and("net_diameter_cm", "net_length_cm", "net_mesh_size_um", "net_type")
      // ".and('tow_duration','tow_start_time','tow_end_time')"
    ),
    tow_uid: {},
    tow_id: {
      output: "Tow_ID"
    },
    net_id: {
      output: "Net_ID"
    },
    hakai_net_id: {},
    tow_start_time: {
      output: "Start_Tow_Time",
      matches: ["Start_Tow_Time", "Start Tow Time", "Tow Start Time"]
    },
    tow_bottom_time: {
      output: "Bottom_Tow_Time",
      matches: [
        "tow_bottom_time",
        "Bottom_Tow_Time",
        "Bottom Tow Time",
        "Tow Bottom Time"
      ]
    },
    tow_end_time: {
      output: "End_Tow_Time",
      matches: ["tow_end_time", "End_Tow_Time", "End Tow Time", "Tow End Time"]
    },
    tow_time_flag: {
      matches: ["tow_time_flag", "Tow Time Flag"]
    },
    analyzed_weight_mg: {
      output: "analyzed_weight",
      matches: ["Amount (mg)", "weight_mg", "Analyzed Weight (mg)"]
    },
    volume: {
      output: "_1__Volume",
      matches: ["volume", "Volume (ml)", "volume_ml"],
      joi: Joi.number()
    },
    flow_meter: {
      output: "Flow_Meter",
      matches: ["flowmeter_sn"]
    },
    flow_in: {
      output: "Flow_in",
      matches: ["Flowmeter Before"],
      joi: Joi.number()
    },
    flow_out: {
      output: "Flow_out",
      matches: ["Flowmeter After"],
      joi: Joi.number()
    },
    flow_meter_volume: {
      output: "Flow_meter_volume",
      matches: ["Flow_Meter_Volume", "Flow Meter Volume"]
    },
    depth_volume: {},
    volume_ratio: {},
    flow_meter_flag: {
      output: "Flow_Meter_Flag",
      matches: ["Flow Meter Flag"]
    },
    flow_meter_volume_flag: {
      output: "Flow_Meter_Volume_Flag",
      matches: ["Flow Meter Volume Flag"]
    },
    flow_meter_ratio: {},
    net_diameter_cm: {
      output: "Diameter__cm_",
      matches: ["Net Dim. (cm)"],
      joi: Joi.number()
    },
    net_length_cm: {
      output: "Length__cm_",
      matches: ["Net Length (cm)"],
      joi: Joi.number()
    },
    net_mesh_size_um: {
      output: "Mesh_Size",
      matches: ["Mesh Size (um)"],
      joi: Joi.number()
    },
    net_type: {
      output: "Configuration",
      matches: ["Net Configuration"]
    },
    sample_portion: {
      matches: ["Fraction Of Sample", "sample_portion"]
    },
    screen_size: {
      matches: ["Size Fraction (um)", "Size Fraction", "screen_size"],
      joi: Joi.alternatives([
        Joi.number()
          .integer()
          .valid([4000, 2000, 1000, 500, 250, 125, 64])
          .when("process", { is: "Size Fraction", then: Joi.required() }),
        Joi.string().valid("total")
      ])
    },
    tow_type: {
      output: "Type",
      matches: ["Haul Type"]
    },
    tow_duration: {
      output: "Tow_Duration__mm_ss_",
      matches: ["Tow Duration"]
      // "joi": "Joi.any().when('tow_type', {is: 'H', then: Joi.required()})"
    },
    dominant_composition: {
      output: "Dominant_Composition",
      matches: ["Dominant Species", "Dominant Compositions"]
    },
    species_abundance: {
      output: "Abundance",
      matches: ["Dominant Species Abundance"]
    },
    species_abundance_flag: {
      output: "abundance_flag",
      matches: ["Dominant Species Abundance Flag"]
    },
    species_length: {
      output: "Length__mm_",
      matches: ["Dominant Group Length", "Dominant Species Length"]
    },
    species_length_flag: {
      output: "dominant_species_length_flag",
      matches: ["Dominant Species Length Flag"]
    },
    species_wet_weight: {
      output: "Wet_Weight",
      matches: [
        "Dominant Species Wet Weight",
        "Wet Weight",
        "Species Wet Weight"
      ]
    },
    wet_weight_equation: {},
    wet_weight_flag: {},
    volume_displacement: {
      output: "Volume_Displacement",
      matches: [
        "Dominant Species Volume Displacement",
        "Species Volume Displacement",
        "Volume Displacement"
      ]
    },
    volume_displacement_flag: {
      matches: [
        "Dominant Species Volume Displacement Flag",
        "Species Volume Displacement Flag",
        "Volume Displacement Flag"
      ]
    },
    total_biomass: {
      matches: ["Biomass", "total_biomass"]
    },
    biomass_equation: {},
    biomass_flag: {},
    vol_biomass_method: {
      output: "volumetric_biomass_method",
      matches: ["Volumetric Biomass Method"],
      joi: Joi.any()
        .valid("DE", "FE")
        .optional()
    },
    volumetric_biomass_final: {},
    vol_biomass_final_flag: {
      output: "volumetric_biomass_final_flag",
      matches: ["Volumetric Biomass Final Flag"]
    },
    sub_sample_count: {},
    sub_sample_factor: {},
    total_count: {},
    total_sf_estimated_count: {},
    total_estimated_count: {},
    estimated_density_m3: {
      matches: ["TEstimated Density (m3)"]
    },
    estimated_total_density_m3: {
      matches: ["Estimated Total Density (m3)"]
    },
    process: {
      output: "Size_Fraction__Unfiltered_or_Total_Biomass",
      matches: ["Process", "Size_Fraction__Unfiltered_or_Total_Biomass"],
      joi: Joi.string().required()
    }
  }
};

const defaultMarineGEO = {
  ...defaultHeaders,
  ...{
    event_notes: {
      matches: ["event_notes", "event notes"]
    },
    dive_supervisor: {
      level: 1,
      matches: [
        "dive_supervisor",
        "dive supervisor",
        "field_staff",
        "Field Staff"
      ]
    },
    surveyor: {
      matches: ["collector"]
    },
    hakai_sample_id: {
      matches: ["Hakai ID"],
      joi: Joi.alternatives([
        Joi.string().regex(/^[\w\d_-]+$/, { name: "Sample ID" }),
        Joi.number()
      ])
    },
    seagrass_habitat_id: {
      level: 1
    },
    collection_id: {},
    sample_type: {},
    transect_dist: {
      matches: ["transect dist (m)"]
    },
    bag_uid: {
      joi: Joi.alternatives([
        Joi.string().regex(/^[\w\d_-]+$/, { name: "Sample ID" }),
        Joi.number()
      ])
    },
    sample_uid: {
      matches: ["sample uid"]
    },
    bag_number: {
      matches: ["bag number"],
      joi: Joi.number()
    },
    Sample_Collected: {},
    habitat_quality_log: {},
    notes: {
      matches: ["comments"]
    },
    collected_start: {
      output: "dive_start_t",
      matches: ["collected", "collected start"],
      joi: Joi.alternatives().try(Joi.number(), Joi.date().max("now"))
    },
    collected_end: {
      output: "dive_end_t",
      joi: Joi.alternatives().try(Joi.number(), Joi.date().max("now"))
    },
    lab_technician: {
      level: 1
    },
    density: {
      joi: Joi.number()
    },
    density_sqm: {
      matches: ["density (m2)"],
      joi: Joi.number()
    }
  }
};

const definitions = {
  defaultHeaders,
  defaultMetadata,
  FGS: {
    ...defaultHeaders,
    _output: "AKAN_CAT_PH",
    soms_station: {}
  },

  FGS_SAMPLES: {
    ...defaultHeaders,
    _output: "AKAN_CAT_PH"
  },
  // TODO why did i have to more defaultheaders?
  EVENTS: {
    ...defaultHeaders,
    _output: "EVENTS",
    event_id: {
      matches: ["Hakai ID"],
      joi: Joi.string()
        .regex(/^[\w\d_-\s:]+$/)
        .min(3)
        .invalid(["na", "nd", "n/d", "n/a"])
        .insensitive()
    },
    event_notes: {
      output: "Notes",
      matches: ["Comments", "comments", "comment"]
    },
    samples: {
      output: "Samples"
    }
  },

  SECCHI: {
    ...defaultHeaders,
    ...{
      _output: "Secchi",
      secchi_depth: {
        output: "Secchi_Depth",
        matches: ["Depth", "depth", "Depth (m)", "sample depth"],
        joi: Joi.alternatives([
          Joi.string().regex(/^\d+-\d+$/, { name: "Depth Range" }),
          Joi.number().min(-1)
        ])
      },
      type: {
        output: "Type",
        matches: ["Secchi Type", "Secchi Disk Type"]
      }
    }
  },

  AKAN_CAT_PH: {
    ...defaultHeaders,
    ...{
      _output: "AKAN_CAT_PH",
      ph_ions_uid: {},
      acidity: {},
      alkh: {},
      ph: {},
      s: {},
      so4: {},
      mg: {},
      zn: {},
      na: {},
      br: {},
      al: {},
      ca: {},
      cl: {},
      fe: {},
      mn: {},
      no3: {},
      b: {},
      f: {},
      k: {},
      p: {},
      no2: {},
      si: {},
      cu: {},
      sr: {},
      acidity_flag: {},
      alkh_flag: {},
      ph_flag: {},
      s_flag: {},
      so4_flag: {},
      mg_flag: {},
      zn_flag: {},
      na_flag: {},
      br_flag: {},
      al_flag: {},
      ca_flag: {},
      cl_flag: {},
      fe_flag: {},
      mn_flag: {},
      id_flag: {},
      no3_flag: {},
      b_flag: {},
      f_flag: {},
      k_flag: {},
      p_flag: {},
      no2_flag: {},
      si_flag: {},
      cu_flag: {},
      sr_flag: {}
    }
  },

  YSI: {
    ...defaultHeaders,
    ...{
      _output: "YSI",
      ysi_uid: {},
      ysi_hakai_id: {
        output: "_1__Sample_ID",
        matches: ["Hakai ID", "Tube number", "Sample ID"],
        joi: Joi.string()
          .regex(/^[\w\d\s:._-]+$/)
          .min(3)
          .invalid(["na", "nd", "n/d", "n/a"])
          .insensitive()
      },
      ysi_unit: {
        output: "YSI_Unit_ID"
      },
      ysi_time: {
        output: "YSI_Time",
        matches: ["ysi_timestamp"]
      },
      ysi_time_flag: {
        output: "YSI_Time_flag",
        matches: ["ysi_timestamp_flag"]
      },
      salinity: {
        output: "salinity",
        matches: ["Salinity (ppt)"]
      },
      temperature: {
        matches: ["Temperature (C)"]
      },
      ysi_qc_comment: {
        matches: ["YSI QC during upload/export"]
      },
      ysi_unit_uid: {},
      specific_conductance: {
        matches: ["Specific Conductance", "Specific Conductance (uS/cm)"]
      },
      orp: {
        matches: ["ORP_1", "ORP_1 (mV)"]
      },
      dissolved_oxygen: {
        matches: ["Dissolved Oxygen (mg/L)"]
      },
      pH: {
        output: "ph",
        matches: ["pH_1", "pH_1 (Units)"]
      },
      folder: {},
      site: {
        matches: ["ysi_site"]
      },
      time_flag: {},
      sc_flag: {
        matches: ["Specific Conductance Flag"]
      },
      orp_flag: {
        matches: ["ORP_1 Flag"]
      },
      do_flag: {
        matches: ["Dissolved Oxygen Flag"]
      },
      temp_flag: {
        matches: ["Temperature Flag"]
      },
      ph_flag: {
        matches: ["ph flag"]
      },
      sal_flag: {
        matches: ["Salinity Flag"]
      },
      depth_flag: {}
    }
  },

  YSI_CALIBRATION: {
    ...defaultHeaders,
    ...{
      _output: "YSI_CALIBRATION",
      ysi_uid: {},
      ysi_calibration_hakai_id: {
        output: "_1__Sample_ID",
        matches: ["Hakai ID", "Tube number", "Sample ID"],
        joi: Joi.string()
          .regex(/^[\w\d\s:._-]+$/)
          .min(3)
          .invalid(["na", "nd", "n/d", "n/a"])
          .insensitive()
      },
      ysi_unit: {
        output: "YSI_Unit_ID"
      },
      sc_standard_id: {},
      ph4_standard_id: {},
      ph7_standard_id: {},
      orp_standard_id: {},
      do_standard_id: {},
      ysi_cable_model: {},
      ysi_cable_sn: {
        output: "YSI_Cable_ID",
        matches: ["ysi cable"]
      },
      ysi_temp: { output: "YSI_Temp" },
      ysi_unit_model: {
        matches: ["ysi unit model", "ysi model"]
      },
      calibration_date: {
        output: "Calibration_Date_and_Time",
        matches: ["calibration"]
      },
      calibrator: { output: "Technician" },
      cell_constant: {
        output: "Cell_Constant"
      },
      do_after_field_value: {},
      do_membrane_changed: {
        output: "DO_Membrane_Changed"
      },
      do_post_calibration_value: {},
      do_pre_calibration_value: {},
      calibration_notes: { output: "Notes", matches: ["notes"] },
      orp_after_field_standard_temperature: {},
      orp_after_field_value_mv: {
        matches: ["orp_after_field_value mv"]
      },
      orp_before_field_standard_temperature: {
        output: "orp_before_field_standard_temperature",
        matches: [
          "orp_before_field_standard_temperature",
          "orp before field standard temperature"
        ]
      },
      orp_post_calibration_value_mv: {
        matches: ["orp post calibration_value mv"]
      },
      orp_pre_calibration_value_mv: {
        matches: ["orp pre calibration value mv"]
      },
      orp_standard_calculated_value_mv: {},
      orp_standard_calculated_value_mv_2: {},
      ph4_after_field_standard_temperature: {},
      ph4_after_field_value: {},
      ph4_before_field_standard_temperature: {},
      ph4_post_calibration_value: {},
      ph4_pre_calibration_value: {},
      ph4_standard_calculated_value: {},
      ph7_after_field_standard_temperature: {},
      ph7_after_field_value: {},
      ph7_before_field_standard_temperature: {},
      ph7_post_calibration_value: {},
      ph7_pre_calibration_value: {},
      ph7_standard_calculated_value: {},
      ysi_program: { output: "Program", matches: ["program"] },
      restored_to_default_calibration: {
        output: "YSI_restored_to_default_calibration_"
      },
      sc_after_field_standard_temperature: {
        output: "sc_after_field_standard_temperature",
        matches: [
          "sc_after_field_standard_temperature",
          "sc after field standard temperature"
        ]
      },
      sc_after_field_value: {
        output: "sc_after_field_value",
        matches: ["sc_after_field_value", "sc_after_field value"]
      },
      sc_before_field_standard_temperature: {
        output: "sc_before_field_standard_temperature",
        matches: [
          "sc_before_field_standard_temperature",
          "sc before field standard temperature"
        ]
      },
      sc_post_calibration_value: {
        output: "sc_post_calibration_value",
        matches: ["sc_post_calibration_value", "sc post calibration value"]
      },
      sc_pre_calibration_value: {
        output: "sc_pre_calibration_value",
        matches: ["sc_pre_calibration_value", "sc pre calibration value"]
      },
      standard_instrument_temperature: {
        output: "Standard_Instrument_Temperature",
        matches: [
          "standard_instrument_temperature",
          "standard instrument temperature"
        ]
      },
      traceable_thermometer_temperature: {
        output: "Traceable_Thermometer_Temperature",
        matches: [
          "traceable_thermometer_temperature",
          "traceable thermometer temperature"
        ]
      }
    }
  },

  SUVA: {
    ...defaultHeaders,
    _output: "SUVA",
    suva_uid: {
      output: "suva_uid",
      matches: ["suva_uid"]
    },
    path_length: {
      output: "path_length_cm",
      matches: ["path_length_cm", "path length"]
    },
    a254: {
      joi: Joi.number()
    },
    a350: {
      joi: Joi.number()
    },
    a250_a365: {
      matches: ["a250:a365"],
      joi: Joi.number()
    },
    a250: {
      joi: Joi.number()
    },
    a365: {
      joi: Joi.number()
    },
    slope_275_295: {
      matches: ["s275_295"],
      joi: Joi.number()
    },
    slope_350_400: {
      matches: ["s350_400"],
      joi: Joi.number()
    },
    slope_275_295_slope_350_400: {
      matches: ["s275_295_s350_400"],
      joi: Joi.number()
    },
    slope_flag: {},
    spectral_slope_ratio: {},
    spectral_slope_ratio_lt_1: {},
    fluorescence_index: {},
    doc_nral: {
      drop: true
    },
    doc_flag_nral: {
      drop: true
    },
    doc_gghatch: {
      drop: true
    },
    doc_flag_gghatch: {
      drop: true
    },
    delta_13cvpdb_doc: {
      drop: true
    },
    delta_13cvpdb_doc_flag: {
      drop: true
    },
    suva_nrl: {
      drop: true
    },
    a350_doc_nral: {
      matches: ["a350/doc nral"],
      drop: true
    },
    suva_gghatch: {
      drop: true
    },
    a350_doc_gghatch: {
      matches: ["a350/doc gghatch"],
      drop: true
    },
    fe: {
      drop: true
    },
    fe_flag: {
      drop: true
    },
    suva_fe_corr_nral: {
      output: "suva_fe_corr_nral",
      matches: ["suva_fe_corr nral", "suva_fe_corr_nral"],
      drop: true
    },
    uva350_fe_corr_nral: {
      output: "uva350_fe_corr_nral",
      matches: ["uva350_fe_corr nral", "uva350_fe_corr_nral"],
      drop: true
    },
    uva350_fe_corr_gghatch: {
      output: "uva350_fe_corr_gghatch",
      matches: ["UVA350_Fe_Corr GGHatch", "uva350_fe_corr_gghatch"],
      drop: true
    },
    suva_fe_corr_gghatch: {
      output: "suva_fe_corr_gghatch",
      matches: ["suva_fe_corr gghatch", "suva_fe_corr_gghatch"],
      drop: true
    },
    suva_flag: {
      output: "suva_flag",
      matches: ["SUVA Flag", "SUVA_QC"]
    },
    abs_flag: {
      output: "absorbance_flag",
      matches: ["Absorbance Flag", "Absorbance_QC"]
    },
    preferred_doc_source: {
      output: "preferred_doc_source",
      matches: ["Preferred DOC Source", "preferred_doc_source"]
    }
  },

  DOC: {
    ...defaultHeaders,
    ...{
      _output: "DOC",
      doc_uid: {
        output: "doc_uid",
        matches: ["doc_uid"]
      },
      dic: {
        output: "dic",
        matches: ["dic"]
      },
      doc: {
        output: "doc",
        matches: ["doc"]
      },
      tic: {
        output: "tic",
        matches: ["tic"]
      },
      toc: {
        output: "toc",
        matches: ["toc"]
      },
      dic_flag: {
        output: "dic_flag",
        matches: ["dic_flag", "dic flag"]
      },
      doc_flag: {
        matches: ["doc flag"]
      },
      tic_flag: {
        matches: ["tic flag"]
      },
      toc_flag: {
        matches: ["toc flag"]
      }
    }
  },

  MICROBIAL: {
    ...defaultHeaders,
    ...{
      _output: "Microbial",
      microbial_uid: {},
      volume: {
        output: "Volume",
        matches: ["Volume (ml)", "volume_ml", "Volume", "volume filtered"]
      },
      sample_type: {
        output: "Type",
        matches: ["Sample Type", "Type"]
      },
      dna_extraction_datetime: {
        matches: ["DNA Extraction Date", "DNA Extraction Time"]
      },
      dna_volume: {
        matches: ["DNA Volume (ul)"]
      },
      dna_volume_te_wash: {
        matches: ["DNA Volume with TE Wash (ul)"]
      },
      qubit_dna_concentration: {
        matches: ["Qubit DNA Concentration (ng/ml)"]
      },
      stock_dna_concentration: {
        matches: ["Stock DNA Conentration (ng/ul)"]
      },
      extracting_staff: {
        matches: ["Extraction Staff"]
      },
      extracting_lab: {
        matches: ["Extraction Lab"]
      }
    }
  },

  DO13C: {
    ...defaultHeaders,
    ...{
      _output: "DO13C",
      do13c_uid: {},
      ppm_c_doc: {},
      delta_13cvpdb_doc: {},
      ppm_c_doc_flag: {},
      delta_13cvpdb_doc_flag: {}
    }
  },

  O18: {
    ...defaultHeaders,
    ...{
      _output: "O18",
      o18_uid: {},
      delta_o18: {},
      delta_h2: {},
      delta_o18_flag: {
        matches: ["ppm C doc flag"]
      },
      delta_h2_flag: {
        matches: ["Delta H2 flag"]
      }
    }
  },

  NUTRIENTS: {
    ...defaultHeaders,
    ...{
      _output: "Nutrients",
      nutrient_uid: {},
      filter_type: {
        output: "Filter_Type"
      },
      volume: {
        output: "_1__Volume",
        matches: ["Volume (ml)", "volume_ml", "Volume", "volume filtered"]
      },
      nh4_: {
        matches: ["NH4NFilt", "NH4+", "NH4 (ug/L)", "NH4+ (ug/L)"]
      },
      no2_no3_ugl: {
        matches: ["no2_no3", "NO3+NO2", "NO2+NO3", "NO2+NO3 (ug/L)"]
      },
      no2_no3_um: {
        matches: ["NO3+NO2", "NO2+NO3", "NO2+NO3 (uM)"]
      },
      no2_no3_units: {
        matches: ["NO2+NO3 Units"]
      },
      tp: {
        matches: ["TotPUnFl", "TP (ug/L)"]
      },
      tn: {
        matches: ["TotNUnFl", "TN (ug/L)"]
      },
      tdp: {
        matches: ["TotPFilt", "TDP (ug/L)"]
      },
      tdn: {
        matches: ["TotNFilt", "TDN (ug/L)"]
      },
      srp: {
        matches: ["SRP (ug/L)"]
      },
      po4: {},
      sio2: {},
      po4pfilt: {},
      no3nfilt: {},
      po4punfl: {},
      no3nunfl: {},
      nh4nunfl: {},
      nh4__flag: {
        matches: ["NH4+ Flag", "NH4 Flag"]
      },
      no2_no3_flag: {
        matches: ["NO2+NO3 Flag"]
      },
      tp_flag: {
        matches: ["totpunfl_flag", "TP Flag"]
      },
      tn_flag: {
        matches: ["totnunfl_flag", "TN Flag"]
      },
      tdp_flag: {
        matches: ["totpfilt_flag", "TDP Flag"]
      },
      tdn_flag: {
        matches: ["totnfilt_flag", "TDN Flag"]
      },
      srp_flag: {},
      po4_flag: {},
      sio2_flag: {},
      po4pfilt_flag: {},
      no3nfilt_flag: {},
      po4punfl_flag: {},
      no3nunfl_flag: {},
      nh4nunfl_flag: {}
    }
  },

  NITRATES: {
    ...defaultHeaders,
    ...{
      _output: "Nutrients2",
      nutrient_uid: {},
      filter_type: {
        output: "Filter_Type"
      },
      volume: {
        output: "_1__Volume",
        matches: ["Volume (ml)", "volume_ml", "volume filtered"]
      },
      d15nair: {},
      d15nair_flag: {}
    }
  },

  POMS: {
    ...defaultFilters,
    ...{
      _output: "POMS",
      poms_uid: {},
      filter_uid: {},
      calibration_id: {
        matches: ["batch", "calibration id"]
      },
      screen_size: {
        matches: ["Size Fraction (um)", "Size Fraction"],
        joi: Joi.alternatives([
          Joi.number()
            .integer()
            .valid([4000, 2000, 1000, 500, 250, 125, 64])
            .when("process", { is: "Size Fraction", then: Joi.required() }),
          Joi.string().valid("total")
        ])
      },
      part: {},
      total_beam_n: {
        matches: ["Total Beam N"]
      },
      ug_n: {
        matches: ["N Amount (ug)"]
      },
      per_n: {
        matches: ["%N"]
      },
      delta_air: {
        matches: ["Delta Air"]
      },
      corr_delta15n: {
        matches: ["corr_15N", "d15N"]
      },
      total_beam_c: {},
      ug_c: {
        matches: ["C Amount (ug)"]
      },
      per_c: {
        matches: ["%C"]
      },
      delta_pdb: {},
      corr_delta13c: {
        matches: ["corr_13C", "d13C"]
      },
      c_n: {
        matches: ["C:N"]
      },
      c_n_flag: {
        matches: ["C:N Flag"]
      },
      c_flag: {},
      n_flag: {},
      volume: {
        output: "_1__Volume",
        matches: ["Volume (ml)"]
      },
      size_fraction: {
        output: "size_fraction",
        matches: ["Size fraction"]
      },
      filter_portion: {},
      Sample_Split: {},
      id_acid: {},
      id_no_acid: {},
      exclude: {},
      acid_to_be_fumed: {
        matches: [
          "Samples to be acidified by fuming",
          "Samples to be acidified by fuming A"
        ]
      },
      acid_fuming: {
        matches: ["Acidified by Fuming Completed"]
      },
      treatment: {
        output: "_1__Acidification_Method",
        matches: ["Acidification_Method", "Acidification Method"]
      }
    }
  },

  FILTERS: {
    ...defaultFilters,
    ...{
      _output: "Filters",
      filter_uid: {}
    }
  },

  CHLOROPHYLL: {
    ...defaultFilters,
    ...{
      _output: "Chlorophyll",
      chl_uid: {},
      blank: {
        matches: ["is_blank"]
      },
      solid_standard: {
        matches: ["is_solid_standard"]
      },
      chl_sample_type: {
        matches: ["Type"]
      },
      size_fraction: {},
      flurometer_uid: {},
      flurometer_serial_no: {
        matches: [
          "Flurometer Serial #",
          "Flurometer Serial Number",
          "Fluorometer Serial #",
          "Fluorometer Serial Number"
        ]
      },
      calibration_date: {
        output: "calibration"
      },
      calibration_slope: {},
      acidification_coefficient: {},
      acid_ratio_correction_factor: {},
      acetone_volume: {
        output: "acetone_volume",
        matches: ["volume of acetone (ml)"],
        joi: Joi.number()
      },
      before_acid: {},
      after_acid: {},
      acid_flag: {},
      chla: {},
      chla_flag: {},
      chla_final: {},
      phaeo: {},
      phaeo_flag: {},
      phaeo_final: {},
      filter_uid: {}
    }
  },

  ZOOPLANKTON_ISOTOPE: {
    ...defaultZooplanktonHeaders,
    ...{
      _output: "Zooplankton",
      _joiobj: defaultZooplanktonHeaders._joiobj.concat(
        Joi.object().with(
          "screen_size",
          "date",
          "site_id",
          "sampling_bout",
          "net_mesh_size_um"
        )
      ),
      plankton_isotope_uid: {},
      filter_uid: {},
      preservation_method: {
        output: "Filtered_Preservation_Method",
        matches: ["Preservation Method"]
      },
      c_flag: {},
      c_n: {
        matches: ["C:N"]
      },
      c_n_flag: {
        matches: ["C:N Flag"]
      },
      ug_c: {
        matches: ["C Amount (ug)"]
      },
      ug_n: {
        matches: ["N Amount (ug)"]
      },
      corr_delta13c: {
        matches: ["d13C"]
      },
      corr_delta15n: {
        matches: ["d15N"]
      },
      delta_air: {},
      delta_pdb: {},
      n_flag: {
        matches: ["N Flag"]
      },
      part: {},
      per_c: {
        matches: ["%C"]
      },
      per_n: {
        matches: ["%N"]
      },
      total_beam_c: {},
      total_beam_n: {},
      plankton_isotope_id: {
        matches: ["Plankton Isotope ID"]
      },
      plankton_total_biomass_id: {
        output: "plankton_total_biomass_id",
        matches: ["Plankton Total Biomass ID"]
      }
    }
  },

  ZOOPLANKTON_FATTY_ACIDS: {
    ...defaultZooplanktonHeaders,
    ...{
      _output: "Zooplankton",
      _joiobj: defaultZooplanktonHeaders._joiobj.concat(
        Joi.object().with(
          "screen_size",
          "date",
          "site_id",
          "sampling_bout",
          "net_mesh_size_um"
        )
      ),
      preservation_method: {
        output: "Filtered_Preservation_Method",
        matches: ["Preservation Method"]
      }
    }
  },

  ZOOPLANKTON_MICROSCOPY: {
    ...defaultZooplanktonHeaders,
    ...{
      _output: "Zooplankton",
      _joiobj: defaultZooplanktonHeaders._joiobj.concat(
        Joi.object().with(
          "screen_size",
          "date",
          "site_id",
          "sampling_bout",
          "net_mesh_size_um"
        )
      ),
      preservation_method: {
        output: "Non_Filtered_Preservation_Method",
        matches: ["Preservation Method"]
      },
      non_filtered_preserved_sample_id: {
        output: "Non_Filtered_Preserved_Sample_ID",
        matches: ["Hakai ID"],
        joi: Joi.string()
          .regex(/^[\w\d_-]+$/)
          .min(3)
          .invalid(["na", "nd", "n/d", "n/a"])
          .insensitive()
      },
      pm_uid: {},
      pmt_uid: {},
      count: {},
      count_sm: {},
      sample_splits: {},
      sub_sample: {},
      taxon: {}
    }
  },

  ZOOPLANKTON_TOW: {
    ...defaultHeaders,
    ...{
      _output: "Zooplankton_tow",
      _joiobj: defaultHeaders._joiobj.concat(
        Joi.object()
          .and("flow_meter", "flow_in", "flow_out")
          .and(
            "net_diameter_cm",
            "net_length_cm",
            "net_mesh_size_um",
            "net_type"
          )
        // ".and('tow_duration','tow_start_time','tow_end_time')"
      ),
      tow_type: {
        output: "Type",
        matches: ["Haul Type"]
      },
      tow_duration: {
        output: "Tow_Duration__mm_ss_"
        // "joi": "Joi.any().when('tow_type', {is: 'H', then: Joi.required()})"
      },
      tow_lat: {
        level: 1,
        drop: true
      },
      tow_long: {
        level: 1,
        drop: true
      },
      tow_id: {
        output: "Tow_ID"
      },
      net_id: {
        output: "Net_ID"
      },
      hakai_net_id: {
        matches: ["Hakai ID"]
      },

      tow_start_time: {
        output: "Start_Tow_Time",
        matches: ["Start_Tow_Time", "Start Tow Time"]
      },
      tow_bottom_time: {
        output: "Bottom_Tow_Time",
        matches: ["Bottom_Tow_Time", "Bottom Tow Time"]
      },
      tow_end_time: {
        output: "End_Tow_Time",
        matches: ["End_Tow_Time", "End Tow Time"]
      },
      tow_time_flag: {},
      combine_nets: {
        matches: ["Combined Nets"]
      },
      volume: {
        output: "_1__Volume",
        matches: ["volume", "Volume (ml)", "volume_ml"],
        joi: Joi.number()
      },
      flow_meter: {
        output: "Flow_Meter",
        matches: ["flowmeter_sn"]
      },
      flow_in: {
        output: "Flow_in",
        matches: ["Flowmeter Before"],
        joi: Joi.number()
      },
      flow_out: {
        output: "Flow_out",
        matches: ["Flowmeter After"],
        joi: Joi.number()
      },
      flow_meter_flag: {
        output: "Flow_Meter_Flag"
      },
      flow_meter_volume: {
        output: "Flow_meter_volume"
      },
      flow_meter_volume_flag: {
        output: "Flow_Meter_Volume_Flag"
      },
      flow_meter2: {
        output: "Flow_Meter_2",
        matches: ["Flow Meter 2", "Flow_Meter_2", "flowmeter_sn2"]
      },
      flow_in2: {
        output: "Flow_in_2",
        matches: ["Flowmeter Before 2"],
        joi: Joi.number()
      },
      flow_out2: {
        output: "Flow_out_2",
        matches: ["Flowmeter After 2"],
        joi: Joi.number()
      },
      flow_meter_flag2: {
        output: "Flow_Meter_Flag2",
        matches: ["Flow Meter Flag 2"]
      },
      flow_meter_volume2: {
        output: "Flow_meter_volume2",
        matches: ["Flow_Meter_Volume_2", "Flow Meter Volume 2"]
      },
      flow_meter_volume_flag2: {
        output: "Flow_Meter_Volume_Flag2",
        matches: ["Flow Meter Volume Flag 2"]
      },
      depth_volume: {},
      volume_ratio: {},
      net_diameter_cm: {
        output: "Diameter__cm_",
        matches: ["Net Dim. (cm)"],
        joi: Joi.number()
      },
      net_length_cm: {
        output: "Length__cm_",
        matches: ["Net Length (cm)"],
        joi: Joi.number()
      },
      net_mesh_size_um: {
        output: "Mesh_Size",
        matches: ["Mesh Size (um)"],
        joi: Joi.number()
      },
      net_type: {
        output: "Configuration",
        matches: ["Net Configuration"]
      },
      distance_from_sample_site: {
        drop: true
      },
      Revelutions: {
        drop: true
      },
      Revelutions2: {
        matches: ["Revelutions 2"],
        drop: true
      },
      Tow_Distance: {
        drop: true
      },
      isotope: {
        drop: true
      },
      fatty_acids: {
        drop: true
      },
      total_biomass: {
        drop: true
      },
      microscopy: {
        drop: true
      },
      net_notes: {
        output: "Net_Notes",
        matches: ["Comments", "comments", "comment"]
      }
    }
  },

  ZOOPLANKTON_TOTAL_BIOMASS: {
    ...defaultZooplanktonHeaders,
    ...{
      _output: "Zooplankton",
      // _joiobj may have been a mistake, probably should have been added to ZOOPLANKTON_BIOMASS
      _joiobj: defaultZooplanktonHeaders._joiobj.concat(
        Joi.object().with(
          "screen_size",
          "date",
          "site_id",
          "sampling_bout",
          "net_mesh_size_um"
        )
      ),
      filter_uid: {},
      // plankton_isotope_id may have been a mistake, probably should have been added to ZOOPLANKTON_BIOMASS
      plankton_isotope_id: {
        output: "_1__Filter_No_",
        matches: ["Plankton Isotope ID"]
      },
      // plankton_total_biomass_id may have been a mistake, probably should have been added to ZOOPLANKTON_BIOMASS
      plankton_total_biomass_id: {
        output: "_1__Filter_No_",
        matches: ["Plankton Total Biomass ID"]
      }
    }
  },

  ZOOPLANKTON_BIOMASS: {
    ...defaultZooplanktonHeaders,
    ...{
      _output: "Zooplankton",
      _joiobj: defaultZooplanktonHeaders._joiobj.concat(
        Joi.object().xor("plankton_isotope_id", "plankton_total_biomass_id")
      ),
      filter_uid: {},
      plankton_isotope_id: {
        output: "_1__Filter_No_",
        matches: ["Plankton Isotope ID"]
      },
      plankton_total_biomass_id: {
        output: "_1__Filter_No_"
      },
      plankton_fatty_acids_id: {
        output: "_1__Filter_No_"
      },
      hakai_biomass_id: {
        matches: ["Hakai ID"],
        joi: Joi.string()
          .regex(/^[\w\d_-]+$/)
          .min(3)
          .invalid(["na", "nd", "n/d", "n/a"])
          .insensitive()
      }
    }
  },

  PHYTOPLANKTON: {
    ...defaultHeaders,
    ...{
      _output: "Phytoplankton",
      net_diameter_cm: {
        output: "Diameter__cm_",
        matches: ["Net Dim. (cm)"]
      },
      net_length_cm: {
        output: "Length__cm_",
        matches: ["Net Length (cm)"]
      },
      net_mesh_size_um: {
        output: "Mesh_Size",
        matches: ["Mesh Size (um)"]
      },
      net_type: {
        output: "Configuration",
        matches: ["Net Configuration"]
      },
      volume: {
        output: "_1__Volume",
        matches: ["volume", "Volume (ml)", "volume_ml"]
      },
      sample_style: {
        output: "Sample_Style"
      },
      lugols: {
        output: "Lugols"
      }
    }
  },

  HPLC: {
    ...defaultFilters,
    ...{
      _output: "HPLC",
      hplc_uid: {}
    }
  },

  C13INCUBATIONS: {
    ...defaultFilters,
    ...{
      _output: "C13_Incubations",
      c13incubations_uid: {
        matches: ["c13i_uid"]
      },
      filter_uid: {},
      sample_type: {
        output: "_1__Sample_Type",
        matches: ["Incubation Type"]
      },
      inoculation_time: {
        output: "Inoculation_Time"
      },
      incubation_start_time: {
        output: "Incubation_Start_Time"
      },
      incubation_end_time: {
        output: "Incubation_End_Time"
      },
      filtering_end_time: {
        output: "_1__End_Time",
        matches: ["Filtered"]
      }
    }
  },

  PON_POC: {
    ...defaultFilters,
    ...{
      _output: "PON_POC",
      pon_poc_uid: {},
      filter_uid: {}
    }
  },

  POP: {
    ...defaultFilters,
    ...{
      _output: "POP",
      pop_uid: {},
      filter_uid: {}
    }
  },

  POMFAS: {
    ...defaultFilters,
    ...{
      _output: "POM_Fatty_Acids",
      _joiobj: defaultFilters._joiobj.concat(
        Joi.object().with("filter_no", "depth", "site_id", "date")
      ),
      pomfas_uid: {},
      filter_uid: {}
    }
  },

  MUSSELS: {
    _output: "Mussels",

    start_purge_datetime: {},
    start_purge_water_temp: {},
    stop_purge_datetime: {},
    stop_purge_water_temp: {},
    mussel_length: {},
    mussel_gross_weight: {},
    mussel_weight_weight: {},
    mussel_dry_weight: {},
    corr_delta13c: {
      matches: ["corr_13C", "d13C"]
    },
    ug_c: {
      matches: ["C Amount (ug)"]
    },
    corr_delta15n: {
      matches: ["corr_15N", "d15N"]
    },
    ug_n: {
      matches: ["N Amount (ug)"]
    },
    c_flag: {},
    n_flag: {
      matches: ["N Flag"]
    },
    analyzed_weight_mg: {
      output: "analyzed_weight",
      matches: ["Amount (mg)", "weight_mg", "Analyzed Weight (mg)"]
    },
    analyzed_material_type: {
      matches: ["Type of Material"]
    },
    analysis_performed: {
      matches: ["Analysis"]
    },
    was_enriched: {
      matches: ["Enriched?"]
    },
    estimated_enrichment: {}
  },

  MG_SEAGRASS_HABITAT: {
    ...defaultMarineGEO,
    ...{
      _output: "seagrass_habitat_observations",
      hakai_sample_id: {
        output: "bag_uid",
        matches: ["hakai_sample_id", "Hakai ID"],
        joi: Joi.alternatives([
          Joi.string().regex(/^[\w\d_-]+$/, { name: "Sample ID" }),
          Joi.number()
        ])
      },
      density: {
        matches: ["density range", "density_range"]
      },
      substrate: {},
      patchiness: {},
      adj_habitat_1: {},
      adj_habitat_2: {},
      sample_collected: {},
      vegetation_1: {},
      vegetation_2: {},
      notes: {}
    }
  },

  MG_SEAGRASS_BIOMASS: {
    ...defaultMarineGEO,
    ...{
      _output: "seagrass_list",
      density: {
        matches: ["density_range", "density range"]
      },
      substrate: {},
      patchiness: {},
      adj_habitat_1: {},
      adj_habitat_2: {},
      sample_collected: {},
      vegetation_1: {},
      vegetation_2: {},
      habitat_notes: {},
      result_uid: {
        matches: ["hakai_sample_id", "Hakai ID"],
        joi: Joi.alternatives([
          Joi.string().regex(/^[\w\d_-]+$/, { name: "Sample ID" }),
          Joi.number()
        ])
      },
      measurement_type: {},
      length_cm: {
        output: "shoot_length",
        matches: [
          "shoot_length",
          "length_cm",
          "shoot_length_cm",
          "shoot length (cm)",
          "length_mm",
          "shoot_length_mm",
          "shoot length (mm)"
        ],
        joi: Joi.number()
      },
      width_cm: {
        output: "shoot_width",
        matches: [
          "shoot_width",
          "shoot_width_cm",
          "shoot width (cm)",
          "width_mm",
          "shoot_width_mm",
          "shoot width (mm)"
        ],
        joi: Joi.number()
      },
      shoot_broken: {},
      num_blades: {
        output: "number_of_blades",
        matches: ["number of blades"],
        joi: Joi.number()
      },
      foil_weight: {
        output: "foil_weight_mg",
        matches: ["foil_weight_mg", "foil weight", "foil weight (mg)"],
        joi: Joi.number()
      },
      foil_dry_sample_weight: {
        matches: ["foil_dry_sample_weight_mg", "foil dry sample weight (mg)"],
        joi: Joi.number()
      },
      dry_sample_weight: {
        output: "dry_sample_weight_mg",
        matches: ["dry_sample_weight_mg", "dry sample weight (mg)"],
        joi: Joi.number()
      },
      lab_date: {},
      seagrass_biomass_notes: {}
    }
  },

  MG_MESOGRAZERS: {
    ...defaultMarineGEO,
    ...{
      _output: "mesograzers_list",
      density: {
        matches: ["density_range", "density range"]
      },
      substrate: {},
      patchiness: {},
      adj_habitat_1: {},
      adj_habitat_2: {},
      sample_collected: {},
      vegetation_1: {},
      vegetation_2: {},
      habitat_notes: {},
      result_uid: {
        matches: ["hakai_sample_id", "Hakai ID"],
        joi: Joi.alternatives([
          Joi.string().regex(/^[\w\d_-]+$/, { name: "Sample ID" }),
          Joi.number()
        ])
      },
      species: {},
      quantity: {},
      avg_length_mm: {
        output: "avg_length",
        matches: [
          "avg_length",
          "avg length (mm)",
          "avg_length_cm",
          "avg length (cm)"
        ]
      },
      min_length_mm: {
        output: "min_length",
        matches: [
          "min_length",
          "min length (mm)",
          "min_length_cm",
          "min length (cm)"
        ]
      },
      max_length_mm: {
        output: "max_length",
        matches: [
          "max_length",
          "max length (mm)",
          "max_length_cm",
          "max length (cm)"
        ]
      },
      foil_weight_mg: {
        matches: ["foil_weight_mg", "foil weight (mg)"]
      },
      foil_dry_sample_weight_mg: {
        matches: ["foil_dry_sample_weight_mg", "foil dry sample weight (mg)"]
      },
      dry_sample_weight_mg: {
        matches: ["dry sample weight (mg)"]
      },
      lab_date: {
        matches: ["lab date"]
      },
      mesograzer_notes: {}
    }
  },

  MG_MACROALGAE: {
    ...defaultMarineGEO,
    ...{
      _output: "macroalgae_list",
      density: {
        matches: ["density_range", "density range"]
      },
      substrate: {},
      patchiness: {},
      adj_habitat_1: {
        matches: ["adj habitat 1"]
      },
      adj_habitat_2: {},
      sample_collected: {},
      vegetation_1: {},
      vegetation_2: {},
      habitat_notes: {},
      result_uid: {
        matches: ["hakai_sample_id", "Hakai ID"],
        joi: Joi.alternatives([
          Joi.string().regex(/^[\w\d_-]+$/, { name: "Sample ID" }),
          Joi.number()
        ])
      },
      species: {},
      foil_weight_g: {
        output: "foil_weight_mg",
        matches: ["foil_weight_mg", "foil weight (mg)"]
      },
      foil_dry_sample_weight_g: {
        output: "foil_dry_sample_weight_mg",
        matches: ["foil dry sample weight (mg)"]
      },
      dry_sample_weight_g: {
        output: "dry_sample_weight_mg",
        matches: ["dry sample weight (mg)"]
      },
      lab_date: {},
      macroalgae_notes: {}
    }
  },

  MG_EPIPHYTES: {
    ...defaultMarineGEO,
    ...{
      _output: "epiphytes_list",
      density: {
        matches: ["density_range", "density range"]
      },
      substrate: {},
      patchiness: {},
      adj_habitat_1: {},
      adj_habitat_2: {},
      sample_collected: {},
      vegetation_1: {},
      vegetation_2: {},
      habitat_notes: {},
      result_uid: {
        matches: ["hakai_sample_id", "Hakai ID"],
        joi: Joi.alternatives([
          Joi.string().regex(/^[\w\d_-]+$/, { name: "Sample ID" }),
          Joi.number()
        ])
      },
      species: {},
      avg_length_mm: {
        output: "avg_length",
        matches: [
          "avg_length",
          "avg length (mm)",
          "avg_length_cm",
          "avg length (cm)"
        ]
      },
      min_length_mm: {
        output: "min_length",
        matches: [
          "min_length",
          "min length (mm)",
          "min_length_cm",
          "min length (cm)"
        ]
      },
      max_length_mm: {
        output: "max_length",
        matches: [
          "max_length",
          "max length (mm)",
          "max_length_cm",
          "max length (cm)"
        ]
      },
      quantity: {},
      foil_weight: {
        output: "foil_weight_mg",
        matches: ["foil_weight_mg", "foil weight (mg)"]
      },
      foil_dry_sample_weight: {
        output: "foil_dry_sample_weight_mg",
        matches: ["foil_dry_sample_weight_mg", "foil dry sample weight (mg)"]
      },
      dry_sample_weight: {
        output: "dry_sample_weight_mg",
        matches: ["dry_sample_weight_mg", "dry sample weight (mg)"]
      },
      lab_date: {},
      epiphyte_notes: {}
    }
  },

  MG_CLAMS: {
    ...defaultMarineGEO,
    ...{
      _output: "clam_samples",
      hakai_sample_id: {
        output: "bag_uid",
        matches: ["Hakai ID"],
        joi: Joi.alternatives([
          Joi.string().regex(/^[\w\d_-]+$/, { name: "Sample ID" }),
          Joi.number()
        ])
      },
      substrate: {},
      percent_cover_substrate: {},
      percent_cover_algae: {},
      percent_cover_detritus: {},
      percent_cover_seagrass: {},
      percent_cover_shell_hash: {},
      number_siphons: {},
      species: {},
      fragment: {},
      height_mm: {
        matches: ["height (mm)"]
      },
      width_mm: {
        matches: ["width (mm)"]
      },
      fouling_percent: {},
      otter_predation: {},
      lab_date: {},
      notes: {}
    }
  },

  MG_FILTERED_EPIPHYTES: {
    ...defaultMarineGEO,
    _output: "filtered_epiphytes_list",
    density: {
      matches: ["density_range", "density range"]
    },
    substrate: {},
    patchiness: {},
    adj_habitat_1: {},
    adj_habitat_2: {},
    sample_collected: {},
    vegetation_1: {},
    vegetation_2: {},
    habitat_notes: {
      matches: ["habitat_notes", "habitat notes"]
    },
    result_uid: {
      matches: ["result uid", "hakai_sample_id", "Hakai ID"],
      joi: Joi.alternatives([
        Joi.string().regex(/^[\w\d_-]+$/, { name: "Sample ID" }),
        Joi.number()
      ])
    },
    foil_filter_weight_mg: {
      matches: [
        "foil filter weight mg",
        "foil filter weight (mg)",
        "foil and filter weight (mg)"
      ]
    },
    foil_filter_dry_sample_weight_mg: {
      matches: [
        "foil filter dry sample weight mg",
        "foil filter dry sample weight (mg)",
        "foil dry sample weight (mg)"
      ]
    },
    dry_sample_weight_mg: {
      matches: ["dry sample weight (mg)"]
    },
    lab_date: {},
    filtered_epiphyte_notes: {}
  },

  MG_FISH: {
    ...defaultMarineGEO,
    _output: "fish_observations",
    species: {},
    quantity: {},
    length_cm: {
      matches: ["length (cm)"]
    },
    estimated_quantity: {},
    notes: {}
  },

  MG_SEAGRASS_DENSITY: {
    ...defaultMarineGEO,
    _output: "seagrass_density_observations",
    canopy_height_cm: {
      matches: ["canopy height (cm)"]
    },
    notes: {}
  },

  MG_INVERTS: {
    ...defaultMarineGEO,
    _output: "invertebrates_list",
    species: {},
    quantity: {},
    size_cm: {
      matches: ["size (cm)"]
    },
    notes: {}
  },

  SOLO_DROPS: {
    ...defaultHeaders,
    _output: "Niskin_and_Solo_ID_s",
    solo_hakai_id: {
      output: "_1__Sample_ID",
      matches: ["Hakai ID"],
      joi: Joi.string()
        .regex(/^[\w\d\s:._-]+$/)
        .min(3)
        .invalid(["na", "nd", "n/d", "n/a"])
        .insensitive()
    },
    solo_unit_sn: {
      output: "Solo_ID",
      matches: ["solo unit"]
    },
    drop_type: {},
    target_depth_m: {
      output: "Depth",
      matches: ["Target Depth", "depth", "target depth (m)"],
      joi: Joi.number().min(0)
    }
  },

  SEMSP_FISH: {
    ...defaultHeaders,
    _output: "semsp_fish",
    semsp_id: {},
    seine_id: {},
    package_id: {},
    fish_time_out: {},
    fish_time_dewar: {},
    date_processed: {},
    fork_length_field: { matches: ["Fork Length Field (mm)"] },
    height_field: { matches: ["Height (mm)"] },
    cwt: { matches: ["Coded Wire Tag"] },
    adipose: {},
    weight: { matches: ["Weight (g)"] },
    weight_field: { matches: ["Weight Field (g)"] },
    fork_length: { matches: ["Fork Length Lab (mm)"] },
    photo_number: {},
    comments_protocol: {},
    comments_fish_health_lab: {},
    dissector: {},
    dissection_protocol: {},
    qc_data: {},
    analysis_planned: {},
    dissection_status: {},
    cal_cope_field: {},
    lep_cope_field: {},
    chal_a_field: {},
    chal_b_field: {},
    cal_mot_field: {},
    cgf_field: {},
    lpam_field: {},
    lpaf_field: {},
    lam_field: {},
    laf_field: {},
    lgf_field: {},
    unid_cope_field: {},
    unid_chal_field: {},
    chal_scar: {},
    mot_scar: {},
    pred_scar: {},
    hemorrhaging: {},
    eroded_gill_plate: {},
    grazed_gill_plate: {},
    mate_guarding: {},
    pinched_belly: {},
    comments_fish_health_field: {},
    licing_protocol_field: {},
    cm_lab: {},
    cpaf_lab: {},
    caf_lab: {},
    cgf_lab: {},
    lgf_lab: {},
    laf_lab: {},
    lpaf_lab: {},
    lpam_lab: {},
    lam_lab: {},
    ucal_lab: {},
    ulep_lab: {},
    lab_count_no: {},
    lab_count_no_id: {},
    lice_id_protocol_lab: {},
    lice_collection_protocol: {},
    lab_staff: {},
    species: {},
    standard_length: { matches: ["Standard Length (mm)"] }
  }
};

definitions.CHLOROPHYLL_BLANKS = {
  ...definitions.CHLOROPHYLL,
  _output: "Chlorophyll",
  _joiobj: Joi.any()
};

definitions.CHLOROPHYLL_SOLID_STANDARDS = {
  ...definitions.CHLOROPHYLL,
  _output: "Chlorophyll",
  _joiobj: Joi.any()
};
// const module  = {};
module.exports = definitions;
