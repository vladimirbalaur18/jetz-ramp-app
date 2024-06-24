export function onlyIntNumber(s: string){
  return s.replace(/[,.-]/g, "")
}

export function replaceCommaWithDot(s: string){
    return s.replace(/,/g, ".").replace(/-/g, "")
}