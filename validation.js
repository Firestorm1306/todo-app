//all validations here
export function validateName(str){
    const regex=/^[a-zA-Z ]{2,30}$/;
    return regex.test(str)?"":"Invalid TaskName";
}
export function validateDesc(str){
    const regex=/^[a-zA-Z0-9 ]{2,50}$/;
    return regex.test(str)?"":"Invalid Description";
}
export function validateDate(inputDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // remove time portion
    const selectedDate = new Date(inputDate);
    selectedDate.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
        return "Date cannot be in the past.";
    }
    return ""; // No error
}

//export default validateName;
