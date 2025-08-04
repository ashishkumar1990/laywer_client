/**
 * Custom responses for the APIs
 */

export const serverDownResponse = (error: Error) => {
    console.log(error.name, "error");
    return {
        success: false,
        data: {
            message: error.message
        }
    };
};

export const authResponse = {
    success: false,
    data: {
        code: 500,
        _message: "Login to continue...!"
    }
};

export const allFieldsResponse = {
    success: false,
    data: {
        message: "All fields are mandatory!"
    }
};

export const duplicateResponse = {
    success: false,
    data: {
        message: ""
    }
};

export default authResponse;
