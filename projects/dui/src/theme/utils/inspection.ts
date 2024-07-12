import { Theme } from '../interfaces/theme';
export function themeHas(theme: Theme, system: string) : boolean {
    let version = themeVersion(theme);
    if(version==0){
        return true;
    }else if(version==1){
        if(system=='base')
            return theme["ase-tokens"] != null;
        if(system=='color')
            return theme["color-tokens"] != null;
        if(system=='typography')
            return theme["typography-tokens"] != null;
        if(system=='density')
            return theme["density-scale"] != null;
        throw new Error('Valid systems are: base, color, typography, density. Got:' + system);
    }else{
        throw new Error('Unrecognized theme version:' + version);
    }
}
export function themeVersion(theme: Theme) : number {
    return theme["theme-version"] || 0;
}