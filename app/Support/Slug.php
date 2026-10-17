<?php

namespace App\Support;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class Slug
{
    public static function make(string $text, string $table, ?int $ignoreId = null): string
    {
        $base = Str::slug($text, '-', 'bn') ?: 'item-'.Str::lower(Str::random(5));
        $slug = $base;
        $i = 2;
        while (DB::table($table)->where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $slug = $base.'-'.$i++;
        }

        return $slug;
    }
}
