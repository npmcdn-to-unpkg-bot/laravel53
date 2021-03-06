<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Model\User;
use App\Http\Model\Fields;
use Auth;
use DB;
use Route;
use Illuminate\Http\Request;

class InfoController extends Controller {
    
    public function __construct() {
        $this->middleware('auth');
    }
    
    public function getRolesGroup(Request $request) {
        $roles = DB::table('roles')->get();
        $res = array();
        $r = array();
        foreach($roles as $role){
            $r['title'] = $role->display_name;
            $r['value'] = $role->id;
            $res[] = $r;
        }
        return response()->json($res);
    }
    
    public function getCategory(Request $request) {
        $categorys = DB::table('article_category')->where('taxonomy','category')->where('pid',0)->get();
        $res = $this->getCat($categorys);
        // $r = array();
        // foreach($categorys as $category){
        //     $r['title'] = $category->category_name;
        //     $r['value'] = $category->id;
        //     $res[] = $r;
        // }
        return response()->json($res);
    }
    
    public function getCat($categorys) {
        $res = array();
        $r = array();
        foreach($categorys as $category){
            $r['title'] = $category->category_name;
            $r['value'] = $category->id;
            $cats = DB::table('article_category')->where('taxonomy','category')->where('pid',$category->id)->get();
            if(!empty($cats)){
                $r['sub'] = $this->getCat($cats);
            }
            $res[] = $r;
        }
        return $res;
    }
    
    public function getTags(Request $request) {
        $tags = DB::table('article_category')->where('taxonomy','tags')->get();
        $res = array();
        foreach($tags as $tag){
            $r = array();
            $r['title'] = $tag->category_name;
            $r['value'] = $tag->id;
            $res[] = $r;
        }
        return response()->json($res);
    }
    
    public function getPermtsGroup(Request $request) {
        $res = array();
        $routeCollection = Route::getRoutes();
        foreach ($routeCollection as $value) {
            $arr = $value->getAction();
            if($arr['prefix'] !== 'api'&& !strpos($arr['controller'],'postAdd')){
                $rs = array();
                // if(strpos($arr['controller'],'AdminController')){
                $rs['title'] = $arr['controller'];
                $rs['value'] = $arr['controller'];
                $res[] = $rs;
                // }
            }
        }
        return response()->json($res);
    }
}