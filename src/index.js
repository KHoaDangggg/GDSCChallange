function sum(...rest) {
    let sum = rest.reduce((acc, ele) => {
        return acc + ele;
    });
    console.log(sum);
}
sum(1, 2, 3, 4, 5, 6);
