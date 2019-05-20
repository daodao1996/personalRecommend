// const arr1 = [0,0,0,0];
// const arr2 = [0,0,0,0];
//
// console.log(pearson(arr1,arr2));

function pearson(user1,user2) {
    let averageUser1 = user1.reduce((a,b) => a+b) / user1.length;
    let averageUser2 = user2.reduce((a,b) => a+b) / user2.length;
    return Math.abs(getNumerator(averageUser1,averageUser2,user1,user2) /
    getDenominator(averageUser1,averageUser2,user1,user2));
}

function getNumerator(average1,average2,user1,user2) {
  let total=0;
  for(let i=0;i<user1.length;i++){
    total += (user1[i]-average1)*(user2[i]-average2);
  }
  return total;
}

function getDenominator(average1,average2,user1,user2) {
  let total1 = 0;
  let total2 = 0;
  for(let i=0;i<user1.length;i++){
    total1 += Math.pow(user1[i]-average1,2);
    total2 += Math.pow(user2[i]-average2,2);
  }
  return Math.sqrt(total1 * total2);
}

module.exports = pearson;
