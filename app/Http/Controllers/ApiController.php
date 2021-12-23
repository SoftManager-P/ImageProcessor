<?php

namespace App\Http\Controllers;

use JWTAuth;
use App\Models\User;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Exceptions\JWTException;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Validator;

class ApiController extends Controller
{
    public function register(Request $request)
    {
        //Val   idate data
        $data = $request->only('name', 'email', 'password');
        $validator = Validator::make($data, [
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6|max:50'
        ]);

        //Send failed response if request is not valid
        if ($validator->fails()) {
            return response()->json(['error' => $validator->messages()], 200);
        }

        //Request is valid, create new user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password)
        ]);

        //User created, return success response
        return response()->json([
            'success' => true,
            'message' => 'User created successfully',
            'data' => $user
        ], Response::HTTP_OK);
    }

    public function authenticate(Request $request)
    {
        $credentials = $request->only('email', 'password');

        //valid credential
        $validator = Validator::make($credentials, [
            'email' => 'required|email',
            'password' => 'required|string|min:6|max:50'
        ]);

        //Send failed response if request is not valid
        if ($validator->fails()) {
            return response()->json(['error' => $validator->messages()], 200);
        }

        try {
            if (! $token = JWTAuth::attempt($credentials)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Login credentials are invalid.',
                ], 400);
            }
        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Could not create token.',
            ], 500);
        }

        //Token created, return with success response and jwt token
        return response()->json([
            'success' => true,
//            'data' => [
//                "id"=> $user->id,
//                "name"=> $user->name,
//                "email"=> $user->email,
//            ],
            'token' => $token,
            'message' => 'Login Successfull.',
        ]);
    }

    public function logout(Request $request)
    {
        //valid credential
        $validator = Validator::make($request->only('token'), [
            'token' => 'required'
        ]);

        //Send failed response if request is not valid
        if ($validator->fails()) {
            return response()->json(['error' => $validator->messages()], 200);
        }

        //Request is validated, do logout
        try {
            JWTAuth::invalidate($request->token);

            return response()->json([
                'success' => true,
                'message' => 'User has been logged out'
            ]);
        } catch (JWTException $exception) {
            return response()->json([
                'success' => false,
                'message' => 'Sorry, user cannot be logged out'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function get_user(Request $request)
    {
        $this->validate($request, [
            'token' => 'required'
        ]);

        $user = JWTAuth::authenticate($request->token);

        return response()->json(['user' => $user]);
    }

    public function upload_image(Request $request)
    {
        $this->validate($request, [
            'token' => 'required',
        ]);
        $user = JWTAuth::authenticate($request->token);
        $data = $request->only('image', 'type');
        $validator = Validator::make($data, [
            'type' => 'integer',
//            'image' => 'required|max:3000|file|mimes:jpeg,jpg,png'
            'image' => ['required','base64image']
        ],['image.base64image'=>"file must be Image and with following extension jpg,png,jpeg"]);
        if ($validator->fails()) {
            return response()->json(['error' => $validator->messages()], 500);
        }
        $image_file = $request->image;
        $image_type = $request->type;
        if (preg_match('/^data:image\/(\w+);base64,/', $image_file, $type)) {
            $encoded_base64_image = substr($image_file, strpos($image_file, ',') + 1);
            $ext = strtolower($type[1]);
            $decoded_image = base64_decode($encoded_base64_image);
            $make_image = \Image::make($decoded_image);
            if(@$image_type && $image_type == 1){
                $make_image->save($this->make_name($image_type,$ext));
            }elseif(@$image_type && $image_type == 2){
                $make_image->resizeCanvas(512, 512, 'center', false, '#ffffff')->save($this->make_name($image_type,$ext));
            }elseif(@$image_type && $image_type == 3){
                $make_image->resizeCanvas(256, 256, 'center', false, '#ffffff')->save($this->make_name($image_type,$ext));
            }elseif(@$image_type && $image_type == 4){
                $make_image->save($this->make_name(1,$ext));
                $make_image->resizeCanvas(512, 512, 'center', false, '#ffffff')->save($this->make_name(2,$ext));
                $make_image->resizeCanvas(256, 256, 'center', false, '#ffffff')->save($this->make_name(3,$ext));
            }
        }
        return response()->json([
            'success' => true,
            'message' => 'User created successfully',
            'data' => "image"
        ], Response::HTTP_OK);
    }

    function make_name($type,$ext){
        $path = "uploads/";
        if($type == 1){
            $path .= 'orignal-' . rand(00000,99999) . '-' . time() . '.' . $ext;
        }elseif($type == 2){
            $path .= 'resize-512X512-' . rand(00000,99999) . '-' . time() . '.' . $ext;
        }elseif($type == 3){
            $path .= 'resize-256X256-' . rand(00000,99999) . '-' . time() . '.' . $ext;
        }
        return $path;
    }
}
