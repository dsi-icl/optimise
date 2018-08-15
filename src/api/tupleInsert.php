<?php 

include 'utilities.php';
include 'config.php';

$connection=db_connect(OPTIMISE_DB);
$connection->dataStream->insert(json_decode('{

      "STUDYID" : "OPTIMISE",
      "DOMAIN" : "DM",
      "USUBJID" : "OPT-IM-02-1",
      "NHS_USUBJID" : "",
      "DTHDTC" : "",
      "DTHFL" : "",
      "SITEID" : "",
      "INVNAM" : "",
      "SEX" : "Other",
      "BRTHDTC" : "2010-02-01T00:00:00.000Z",
      "DOMINANT" : "Right",
      "ETHNIC" : "Other Asian",
      "COUNTRY" : "CANADA"

}'));


$connection->dataStream->insert(json_decode('{

  "STUDYID" : "OPTIMISE",
  "DOMAIN" : "DM",
  "USUBJID" : "OPT-IM-02-2",
  "NHS_USUBJID" : "",
  "DTHDTC" : "",
  "DTHFL" : "",
  "SITEID" : "",
  "INVNAM" : "",
  "SEX" : "Other",
  "BRTHDTC" : "2010-02-01T00:00:00.000Z",
  "DOMINANT" : "Right",
  "ETHNIC" : "Chinese",
  "COUNTRY" : "CANADA"

}'));

$connection->dataStream->insert(json_decode('{

  "STUDYID" : "OPTIMISE",
  "DOMAIN" : "DM",
  "USUBJID" : "OPT-IM-02-928192",
  "NHS_USUBJID" : "",
  "DTHDTC" : "",
  "DTHFL" : "",
  "SITEID" : "",
  "INVNAM" : "",
  "SEX" : "Other",
  "BRTHDTC" : "2010-02-01T00:00:00.000Z",
  "DOMINANT" : "Right",
  "ETHNIC" : "Chinese",
  "COUNTRY" : "CHINA"

}'));

$connection->dataStream->insert(json_decode('{

  "STUDYID" : "OPTIMISE",
  "DOMAIN" : "DM",
  "USUBJID" : "OPT-IM-02-370",
  "NHS_USUBJID" : "",
  "DTHDTC" : "",
  "DTHFL" : "",
  "SITEID" : "",
  "INVNAM" : "",
  "SEX" : "Male",
  "BRTHDTC" : "1980-02-01T00:00:00.000Z",
  "DOMINANT" : "Left",
  "ETHNIC" : "Black",
  "COUNTRY" : "UNITED KINGDOM"
}'));

$connection->dataStream->insert(json_decode('{

  "STUDYID" : "OPTIMISE",
  "DOMAIN" : "DM",
  "USUBJID" : "OPT-IM-02-370",
  "NHS_USUBJID" : "",
  "DTHDTC" : "",
  "DTHFL" : "",
  "SITEID" : "",
  "INVNAM" : "",
  "SEX" : "Male",
  "BRTHDTC" : "1980-02-01T00:00:00.000Z",
  "DOMINANT" : "Left",
  "ETHNIC" : "Chinese",
  "COUNTRY" : "CANADA"


}'));

$connection->dataStream->insert(json_decode('{

  "STUDYID" : "OPTIMISE",
  "DOMAIN" : "DM",
  "USUBJID" : "OPT-IM-02-38989",
  "NHS_USUBJID" : "",
  "DTHDTC" : "",
  "DTHFL" : "",
  "SITEID" : "",
  "INVNAM" : "",
  "SEX" : "Male",
  "BRTHDTC" : "1980-02-01T00:00:00.000Z",
  "DOMINANT" : "Right",
  "ETHNIC" : "Chinese",
  "COUNTRY" : "AUSTRALIA"


}'));

$connection->dataStream->insert(json_decode('{

  "STUDYID" : "OPTIMISE",
  "DOMAIN" : "DM",
  "USUBJID" : "OPT-IM-02-2130",
  "NHS_USUBJID" : "",
  "DTHDTC" : "",
  "DTHFL" : "",
  "SITEID" : "",
  "INVNAM" : "",
  "SEX" : "Male",
  "BRTHDTC" : "1980-02-01T00:00:00.000Z",
  "DOMINANT" : "Right",
  "ETHNIC" : "Chinese",
  "COUNTRY" : "CANADA"


}'));


$connection->dataStream->insert(json_decode('{

  "USUBJID" : "OPT-IM-02-1090",
  "STUDYID" : "OPTIMISE",
  "DOMAIN" : "EX",
  "EXSEQ" : NumberLong(1),
  "EXTRT" : "Natalizumab (Tysabri)",
  "EXDOSE" : "",
  "EXDOSU" : "",
  "EXDOSFRM" : "",
  "EXDOSFRQ" : "",
  "EXSTDTC" : "2014-11-20T00:00:00.000Z",
  "EXENDTC" : "",
  "EXADJ" : "",
  "displayLabel" : "Natalizumab (Tysabri)",
  "displayDate" : "Thu Nov 20 2014",
  "EXCAT" : "Disease Modifying"

}'));

$connection->dataStream->insert(json_decode('{

  "USUBJID" : "OPT-IM-02-1091",
  "STUDYID" : "OPTIMISE",
  "DOMAIN" : "EX",
  "EXSEQ" : NumberLong(1),
  "EXTRT" : "Natalizumab (Tysabri)",
  "EXDOSE" : "",
  "EXDOSU" : "",
  "EXDOSFRM" : "",
  "EXDOSFRQ" : "",
  "EXSTDTC" : "2014-11-20T00:00:00.000Z",
  "EXENDTC" : "",
  "EXADJ" : "",
  "displayLabel" : "Natalizumab (Tysabri)",
  "displayDate" : "Thu Nov 20 2014",
  "EXCAT" : "Disease Modifying"

}'));

$connection->dataStream->insert(json_decode('{

  "USUBJID" : "OPT-IM-02-1029",
  "STUDYID" : "OPTIMISE",
  "DOMAIN" : "EX",
  "EXSEQ" : NumberLong(1),
  "EXTRT" : "Avonex (Interferon beta-1a)",
  "EXDOSE" : "",
  "EXDOSU" : "",
  "EXDOSFRM" : "",
  "EXDOSFRQ" : "",
  "EXSTDTC" : "2014-11-20T00:00:00.000Z",
  "EXENDTC" : "",
  "EXADJ" : "",
  "displayLabel" : "Avonex (Interferon beta-1a)",
  "displayDate" : "Thu Nov 20 2014",
  "EXCAT" : "Disease Modifying"

}'));

$connection->dataStream->insert(json_decode('{

  "USUBJID" : "OPT-IM-02-1090900",
  "STUDYID" : "OPTIMISE",
  "DOMAIN" : "EX",
  "EXSEQ" : NumberLong(1),
  "EXTRT" : "Avonex (Interferon beta-1a)",
  "EXDOSE" : "",
  "EXDOSU" : "",
  "EXDOSFRM" : "",
  "EXDOSFRQ" : "",
  "EXSTDTC" : "2014-11-20T00:00:00.000Z",
  "EXENDTC" : "",
  "EXADJ" : "",
  "displayLabel" : "Avonex (Interferon beta-1a)",
  "displayDate" : "Thu Nov 20 2014",
  "EXCAT" : "Disease Modifying"

}'));

$connection->dataStream->insert(json_decode('{

  "STUDYID" : "OPTIMISE",
  "DOMAIN" : "CE",
  "USUBJID" : "OPT-IM-02-999",
  "CESEQ" : NumberLong(0),
  "CEGRPID" : NumberLong(0),
  "CELNKID" : "Tue Jan 01 2013 00:00:00 GMT+0000 (GMT) Multiple Sclerosis Relapse",
  "CETERM" : "Multiple Sclerosis Relapse",
  "CESEV" : "Moderate",
  "CESTDTC" : "2013-01-01T00:00:00.000Z",
  "CEENDTC" : "2013-01-01T00:00:00.000Z",
  "CEBODSYS" : "Pyramidal Tract",
  "CEOUT" : "Complete",
  "displayLabel" : "Moderate, Steroids",
  "CECAT" : "MS Relapse",
  "CELAT" : "",
  "displayDate" : "01/2013"

}'));

$connection->dataStream->insert(json_decode('{

  "STUDYID" : "OPTIMISE",
  "DOMAIN" : "CE",
  "USUBJID" : "OPT-IM-02-9976", 
  "CESEQ" : NumberLong(0),
  "CEGRPID" : NumberLong(0),
  "CELNKID" : "Tue Jan 01 2013 00:00:00 GMT+0000 (GMT) Multiple Sclerosis Relapse",
  "CETERM" : "Multiple Sclerosis Relapse",
  "CESEV" : "Severe",
  "CESTDTC" : "2013-01-01T00:00:00.000Z",
  "CEENDTC" : "2013-01-01T00:00:00.000Z",
  "CEBODSYS" : "Pyramidal Tract",
  "CEOUT" : "Complete",
  "displayLabel" : "Severe, Steroids",
  "CECAT" : "MS Relapse",
  "CELAT" : "",
  "displayDate" : "01/2013"

}'));


$connection->dataStream->insert(json_decode('{

  "STUDYID" : "OPTIMISE",
  "DOMAIN" : "CE",
  "USUBJID" : "OPT-IM-02-10666",
  "CESEQ" : NumberLong(0),
  "CEGRPID" : NumberLong(0),
  "CELNKID" : "Tue Jan 01 2013 00:00:00 GMT+0000 (GMT) Multiple Sclerosis Relapse",
  "CETERM" : "Multiple Sclerosis Relapse",
  "CESEV" : "Moderate",
  "CESTDTC" : "2013-01-01T00:00:00.000Z",
  "CEENDTC" : "2013-01-01T00:00:00.000Z",
  "CEBODSYS" : "Pyramidal Tract",
  "CEOUT" : "Complete",
  "displayLabel" : "Moderate, Steroids",
  "CECAT" : "MS Relapse",
  "CELAT" : "",
  "displayDate" : "01/2013"

}'));


$connection->dataStream->insert(json_decode('{

  "USUBJID" : "OPT-IM-02-111",
  "STUDYID" : "OPTIMISE",
  "DOMAIN" : "EX",
  "EXSEQ" : NumberLong(1),
  "EXTRT" : "Natalizumab (Tysabri)",
  "EXDOSE" : "",
  "EXDOSU" : "",
  "EXDOSFRM" : "",
  "EXDOSFRQ" : "",
  "EXSTDTC" : "2014-11-20T00:00:00.000Z",
  "EXENDTC" : "",
  "EXADJ" : "",
  "displayLabel" : "Natalizumab (Tysabri)",
  "displayDate" : "Thu Nov 20 2014",
  "EXCAT" : "Disease Modifying"

}'));

$connection->dataStream->insert(json_decode('{

  "USUBJID" : "OPT-IM-02-1029065",
  "STUDYID" : "OPTIMISE",
  "DOMAIN" : "EX",
  "EXSEQ" : NumberLong(1),
  "EXTRT" : "Avonex (Interferon beta-1a)",
  "EXDOSE" : "",
  "EXDOSU" : "",
  "EXDOSFRM" : "",
  "EXDOSFRQ" : "",
  "EXSTDTC" : "2014-11-20T00:00:00.000Z",
  "EXENDTC" : "",
  "EXADJ" : "",
  "displayLabel" : "Avonex (Interferon beta-1a)",
  "displayDate" : "Thu Nov 20 2014",
  "EXCAT" : "Disease Modifying"

}'));


$connection->dataStream->insert(json_decode('{

  "USUBJID" : "OPT-IM-02-102549",
  "STUDYID" : "OPTIMISE",
  "DOMAIN" : "EX",
  "EXSEQ" : NumberLong(1),
  "EXTRT" : "Avonex (Interferon beta-1a)",
  "EXDOSE" : "",
  "EXDOSU" : "",
  "EXDOSFRM" : "",
  "EXDOSFRQ" : "",
  "EXSTDTC" : "2014-11-20T00:00:00.000Z",
  "EXENDTC" : "",
  "EXADJ" : "",
  "displayLabel" : "Avonex (Interferon beta-1a)",
  "displayDate" : "Thu Nov 20 2014",
  "EXCAT" : "Disease Modifying"

}'));
?>