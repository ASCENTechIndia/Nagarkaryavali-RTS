const { executeProcedureTMC } = require("../../../db/procedureExecutor");

const oracledb = require("oracledb");


async function insertElectricalApplication(params) {
    const {
        userId,
        applicantName,
        mobileNo,
        emailId,
        aadhaarNo,
        residentialAddress,
        panCardNo,
        orgName,
        orgAddress,
        businessType,
        businessDescription,
        permissionFrom,
        permissionTo,
        propertyNo,
        businessAddress,
        roadType,
        roadLength,
        roadWidth,
        roadLengthWidth,
        excavationSize,
        excavationStartPoint,
        excavationEndPoint,
        latitude,
        longitude,
    } = params;


    const sql = `
        BEGIN

            AORTS_ELECTRICAL_INS(
                :in_USERID,
                :in_APPLICANTNAME,
                :in_MOBILENO,
                :in_EMAILID,
                :in_AADHAARNO,
                :in_RESIDENTIALADDRESS,
                :in_PANCARDNO,
                :in_ORGNAME,
                :in_ORGADDRESS,
                :in_BUSINESSTYPE,
                :in_BUSINESSDESCRIPTION,
                :in_PERMISSIONFROM,
                :in_PERMISSIONTO,
                :in_PROPERTYNO,
                :in_BUSINESSADDRESS,
                :in_ROADTYPE,
                :in_ROADLENGTH,
                :in_ROADWIDTH,
                :in_ROADLENGTHWIDTH,
                :in_EXCAVATIONSIZE,
                :in_EXCAVATIONSTARTPOINT,
                :in_EXCAVATIONENDPOINT,
                :in_LATITUDE,
                :in_LONGITUDE,
                :out_errcode,
                :out_ErrMsg,
                :out_electricalid
            );

        END;
    `;

    const binds = {
        in_USERID: userId,

        in_APPLICANTNAME: applicantName,

        in_MOBILENO: mobileNo,

        in_EMAILID: emailId,

        in_AADHAARNO: aadhaarNo,

        in_RESIDENTIALADDRESS: residentialAddress,

        in_PANCARDNO: panCardNo,

        in_ORGNAME: orgName,

        in_ORGADDRESS: orgAddress,

        in_BUSINESSTYPE:
            businessType === "" ||
            businessType === undefined ||
            businessType === null
                ? null
                : Number(businessType),

        in_BUSINESSDESCRIPTION:
            businessDescription,

        in_PERMISSIONFROM:
            permissionFrom
                ? new Date(
                      `${permissionFrom}T00:00:00`
                  )
                : null,

        in_PERMISSIONTO:
            permissionTo
                ? new Date(
                      `${permissionTo}T00:00:00`
                  )
                : null,

        in_PROPERTYNO: propertyNo,

        in_BUSINESSADDRESS:
            businessAddress,

        in_ROADTYPE: roadType,

        in_ROADLENGTH: roadLength,

        in_ROADWIDTH: roadWidth,

        in_ROADLENGTHWIDTH:
            roadLengthWidth,

        in_EXCAVATIONSIZE:
            excavationSize,

        in_EXCAVATIONSTARTPOINT:
            excavationStartPoint,

        in_EXCAVATIONENDPOINT:
            excavationEndPoint,

        in_LATITUDE: latitude,

        in_LONGITUDE: longitude,

        out_errcode: {
            dir: oracledb.BIND_OUT,
            type: oracledb.NUMBER,
        },

        out_ErrMsg: {
            dir: oracledb.BIND_OUT,
            type: oracledb.STRING,
            maxSize: 500,
        },

        out_electricalid: {
            dir: oracledb.BIND_OUT,
            type: oracledb.NUMBER,
        },
    };

    const result = await executeProcedureTMC({
        sql,
        binds,
    });

    if (!result.success) {
        throw new Error(result.error);
    }

    console.log(
        "Electrical Application Insert Result:",
        result
    );

    return result.outBinds;
}

module.exports = {
    
    insertElectricalApplication,
};