<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCustomTailoringsTable extends Migration
{
    public function up()
    {
        Schema::create('custom_tailorings', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('phone');
            $table->string('email');
            $table->float('chest');
            $table->float('waist');
            $table->float('arm_length');
            $table->float('shoulder');
            $table->string('size');
            $table->string('color');
            $table->string('fit_style');
            $table->string('bottom_style')->default('trouser');
            $table->string('fabric');
            $table->string('lapels');
            $table->boolean('is_womens_suit');
            $table->text('additional_description')->nullable();
            $table->string('image_url')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('custom_tailorings');
    }
}
