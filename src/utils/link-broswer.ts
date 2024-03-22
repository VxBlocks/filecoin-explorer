import { FileBrowser, FileHashBrowser } from "../conf/conf"

export const getLinkAddress = (coinType: string, blockHash?: string) => {
    switch (coinType) {
        case "FIL":
            return blockHash? FileHashBrowser : FileBrowser;
        default:
            return FileBrowser;
    }
}





