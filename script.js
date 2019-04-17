"use strict"

let num=0

function getSquare(){
	const hors=['a','b','c','d','e','f','g','h'];
	let h=Math.trunc(num/8);
	let v=1+(num%8);
	return hors[h]+v;
}

function getColor(){
	let h=Math.trunc(num/8);
	let v=num%8;
	return (h+v)%2==0 ? "black" : "white";
}

function getRnd(a,b){
	return Math.trunc(Math.random()*(b-a)+a);
}

function generateSquare(){
	num=getRnd(0,63);
	console.log(num);
}

function prepareQuestion(){
	document.querySelector("#feedback").innerHTML="";
	generateSquare();
	document.querySelector("#question").innerHTML="What color is "+getSquare()+"?";
}

function bodyLoad(){
	document.querySelector("#black").addEventListener("click",submitAnswer);
	document.querySelector("#white").addEventListener("click",submitAnswer);
	prepareQuestion();
}

function submitAnswer(){
	let c=getColor();
	let r = getColor()==this.id ? "Yes. "+getSquare()+" is "+c  : "No. "+getSquare()+" is "+c;
	document.querySelector("#feedback").innerHTML=r;
	window.setTimeout(prepareQuestion,2000);
}