import { rgba} from "../mat-color";
export function safe_color_change($color, alpha) {
    // $args: meta.keywords($args);
    // @return if(meta.type-of($color) == 'color', color.change($color, $args...), $color);
    return rgba($color,alpha);
  }
  export function map_set($map, ...$args) {
    let $first =$args[0];
    let $rest = $args.slice(1);
    
    if($rest.length==1){
      $map['first']=$rest[0];
    }else{
      if(!$map[$first]) 
        $map['first']={};
      map_set($map['first'],$rest);
    }
  }