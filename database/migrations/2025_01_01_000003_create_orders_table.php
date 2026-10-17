<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $t) {
            $t->id();
            $t->string('number')->unique();
            $t->string('token')->unique();
            $t->string('name');
            $t->string('phone', 20);
            $t->text('address');
            $t->string('zone', 3);
            $t->string('payment_method', 10);
            $t->string('trx_id', 40)->nullable();
            $t->unsignedInteger('subtotal');
            $t->unsignedInteger('delivery_fee')->default(0);
            $t->unsignedInteger('discount')->default(0);
            $t->unsignedInteger('total');
            $t->string('status', 12)->default('pending')->index();
            $t->timestamps();
        });

        Schema::create('order_items', function (Blueprint $t) {
            $t->id();
            $t->foreignId('order_id')->constrained()->cascadeOnDelete();
            $t->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $t->string('product_name');
            $t->unsignedInteger('price');
            $t->unsignedSmallInteger('quantity');
            $t->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};
