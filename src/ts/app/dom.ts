export function byId(id:string, doc:Document = document):Element {
    return doc.getElementById(id);
}

export function on(element:any, name:string, handler:Function):void {
    var wrappedHandler = (e:Event) => {
        var result = handler(e);
        if (result === false && e) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            if (e.stopPropagation) {
                e.stopPropagation();
            }
        }
        return result;
    };
    if (element.addEventListener) {
        element.addEventListener(name, wrappedHandler, false);
    } else if (element.attachEvent) {
        element.attachEvent('on' + name, wrappedHandler);
    }
}