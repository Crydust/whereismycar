export class Point{
    constructor(private x:number, private y:number) {
    }
    getX():number{
        return this.x;
    }
    getY():number{
        return this.y;
    }
}

export function toRad(degrees:number):number {
    return degrees * Math.PI / 180;
}

export function toDeg(radians:number):number {
    return radians * 180 / Math.PI;
}
