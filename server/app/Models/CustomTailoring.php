<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomTailoring extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'email',
        'chest',
        'waist',
        'arm_length',
        'shoulder',
        'size',
        'color',
        'fit_style',
        'bottom_style',
        'fabric',
        'lapels',
        'is_womens_suit',
        'additional_description',
        'image_url',
    ];
}
