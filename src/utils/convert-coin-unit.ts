export function transFil(initial: any, power: number = 18) {
    let times = 10 ** power;
    return (Number(initial) / times);
}


export function isHasFixed(value: number) {
    let arr = value.toString().split(".");
    return arr.length > 1
}
