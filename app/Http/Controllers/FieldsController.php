<?php
namespace App\Http\Controllers;

use App\Http\Model\Fields;
use Auth;
use DB;
use Illuminate\Http\Request;

class FieldsController extends Controller {
    
    public function __construct() {
        $this->middleware('auth');
        $this->middleware('admin');
        $this->model = new Fields();
    }
    
    public function getIndex(Request $request) {
        if($request->state != null){
            $this->model = $this->model->where('status', $request->state);
        }
        $pre_page = env('pre_page', 15);
        $data = $this->model->paginate($pre_page);
        $data = $data->toArray();
        $thead =  array('id'=>'ID','key'=>'字段key', 'title'=>'字段名称', 'f_module'=>'字段模块','status'=>'状态');
        $out = array('title' => '字段管理', 'pages' => $data,'thead' => $thead);
        return response()->json($out);
    }
    
    public function getAdd(Request $request) {
        $fields = Fields::file('fields')->get();
        $out = array('title' => '字段', 'fields' => $fields);
        return response()->json($out);
    }
    
    public function postAdd(Request $request) {
        $data = $request->all();
        $info = $this->model->create($data);
        $out = array();
        $out['msg']= '保存成功！';
        $out['info']= $info->toArray();
        return response()->json($out);
    }
    
     public function getDetail($id) {
        $fields = Fields::file('fields')->get();
        $info = Fields::where('id',$id)->first();
        $out = array('title' => '字段', 'fields' => $fields,'info' => $info);
        return response()->json($out);
    }
    
    public function postDetail(Request $request) {
        $info = $this->model->find($request->id);
        $out = array();
        if (empty($info)) {
            $out['res'] = 404;
            $out['msg'] = '没有发现相关数据！';
        }else{
            $res = $info->update($request->all());
            $out['res'] = $res;
            $out['msg'] = '保存成功！';
        }
        return response()->json($out);
    }
}