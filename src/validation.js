import validator from 'validator';

export default function ValidateData(data, rules) {
    const errors = {};
    Object.keys(data).forEach((field) => {
        if (Object.prototype.hasOwnProperty.call(rules, field)) {
            const fieldErrors = [];
            const val = data[field];
            if (rules[field].true) {
                if (!val) {
                    fieldErrors.push('Must be checked');
                }
            } else if (validator.isEmpty(val) && rules[field].required) {
                fieldErrors.push('Value required');
            } else {
                if (rules[field].minlength && !validator.isLength(val, rules[field].minlength)) {
                    fieldErrors.push(`Enter at least ${rules[field].minlength} characters`);
                }
                if (rules[field].alpha && !validator.isAlpha(val)) {
                    fieldErrors.push('Enter only letters');
                }
                if (rules[field].email && !validator.isEmail(val)) {
                    fieldErrors.push('Enter a valid email address');
                }
                if (rules[field].equals && !validator.equals(val, data[rules[field].equals])) {
                    fieldErrors.push("Values don't match");
                }
            }
            if (fieldErrors.length > 0) {
                errors[field] = fieldErrors;
            }
        }
    });
    return errors;
}
