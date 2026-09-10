const { executeProcedureTMC } = require("../../../db/procedureExecutor");

const oracledb = require("oracledb");

async function insertMandapStallApplication(params) {
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
        mandapArea,
    } = params;

    console.log("Insert Mandap / Stall Application:", {
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
        mandapArea,
    });

    const sql = `
        BEGIN

            AORTS_MANDAPSTALL_INS(
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
                :in_MANDAPAREA,
                :out_errcode,
                :out_ErrMsg,
                :out_mandapstallid
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

        in_BUSINESSDESCRIPTION: businessDescription,

        in_PERMISSIONFROM: permissionFrom
            ? new Date(`${permissionFrom}T00:00:00`)
            : null,

        in_PERMISSIONTO: permissionTo
            ? new Date(`${permissionTo}T00:00:00`)
            : null,

        in_PROPERTYNO: propertyNo,

        in_BUSINESSADDRESS: businessAddress,

        in_MANDAPAREA: mandapArea,

        out_errcode: {
            dir: oracledb.BIND_OUT,
            type: oracledb.NUMBER,
        },

        out_ErrMsg: {
            dir: oracledb.BIND_OUT,
            type: oracledb.STRING,
            maxSize: 500,
        },

        out_mandapstallid: {
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
        "Mandap / Stall Application Insert Result:",
        result
    );

    return result.outBinds;
}

module.exports = {
    insertMandapStallApplication,
};