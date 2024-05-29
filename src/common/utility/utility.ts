import { DonorType } from "src/donors/entity/donor.entity"

export function cleanStringList(list: (string | undefined)[]) : string | undefined {
    let res = list.filter(x => !!x).join(" ").trim()
    if (res === "") {
        return undefined
    }
    return res
}

export function cleanNumber(value: string | undefined) : number | undefined {
    try {
        return parseFloat(value)
    }
    catch (e) {
        console.log("Impossible to parse: " + value)
        return undefined
    }
}

export function getTrueFalse(value: string) : boolean {
    let res = cleanStringList([value])
    if (res === null) {
        return false
    }
    return (res.toLocaleLowerCase() === "si")
}

export function getDonorType(value: string) : DonorType {
    if (value.toLocaleLowerCase() === "persona fisica") {
        return DonorType.PERSON
    }
    if (value.toLocaleLowerCase() === "organizzazione") {
        return DonorType.ORGANIZATION
    }
    return DonorType.OTHER
} 

