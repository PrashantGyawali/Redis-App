function capitalizeFirstCharacter(input: string): string {
    if (input.length === 0) {
        return input;
    }
    
    const firstChar = input.charAt(0).toUpperCase();
    const restOfString = input.slice(1);
    
    return firstChar + restOfString;
}

function validTag(input: string): boolean {
    let combinedInput=input.split(" ").join("");
    const regex = /^[A-Za-z][A-Za-z0-9\s/,]*$/;
    return regex.test(combinedInput);
}

export { capitalizeFirstCharacter,validTag };