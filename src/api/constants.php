<?php
/**
 * Created by PhpStorm.
 * User: Yang
 * Date: 24/09/2015
 * Time: 15:14
 */
define ("DB_NAME", "wikihealth");
define ("USER_TABLE", "users");
define ("OPTIMISE_TABLE", "dataStream");
define ("OPTIMISE_DB", "Optimise");
define ("CLINICION_TABLE", "clinicians");
define ("TOKEN_U_TABLE", "token_users");
define ("TOKEN_C_TABLE", "token_clinicians");
define ("GROUPS_TABLE", "groups");
define ("REQUEST_LOG_TABLE", "request_logs");
define ("DIARY_U_TABLE", "diary_users");
define ("SITES_TABLE", "sites");

//API specific variables
define("action","action");
define ("w_id", "w_id");
define ("status", "status");
define ("username", 'username');
define ("password", 'password');
define ("email", "email");
define ("token", "token");
define ("expire_in_seconds", "expire_in_seconds");
define("m_id","m_id");
define("limit","limit");
define("skip","skip");
define ("group_name", 'group_name');
define ("group_id", 'group_id');
define ("group_ids", 'group_ids');
define("primary_group_mongo_id","pgm_id");
define("secondary_group_mongo_ids","sgm_ids");
define("primary_group_id","primary_group_id");
define("nhs_id","nhs_id");
define("optimise_prefix","optimise_prefix");
define("secondary_group_ids","secondary_group_ids");
define("xnat_id","xnat_id");
define("group_manager","group_manager");
define("config","config");
define("site","site");

define("demography_data","demography_data");
//API specific return results
define ("SUCCEED", "succeed");
define ("ERROR", "error");
define ("ERROR_Internal_Error", "internal_error");
define ("ERROR_UsernameExist", "username_exist");
define ("ERROR_Permission_denied", "permission_denied");
define ("ERROR_missing_data", "missing_data");
define ("ERROR_Invalid_Method", "invalid_method");
define ("ERROR_Wrong_Password", "wrong_password");
define ("ERROR_GroupNameExist", "group_name_exist");
define ("ERROR_Invalid_w_id", "invalid_w_id");
define ("ERROR_Invalid_groupID", "invalid_group_id");
define ("ERROR_Invalid_Json", "invalid_json_format");
//API Status
//define ("UserAccount_Stage", "succeed");


//OPTIMISE API ERRROR
define ("ERROR_MISSING_USUBJID", "ERROR_MISSING_USUBJID");


//BACK DOOR
define ("SUPER_ADMIN_PASSWORD", "superadminimperial");
