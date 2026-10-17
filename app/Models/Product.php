<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $guarded = [];

    protected $casts = ['in_stock' => 'boolean', 'is_active' => 'boolean'];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('position')->orderBy('id');
    }

    public function variations(): HasMany
    {
        return $this->hasMany(ProductVariation::class)->orderBy('position')->orderBy('id');
    }

    public function scopeActive(Builder $q): Builder
    {
        return $q->where('is_active', true);
    }

    /** Public (storefront) shape. Needs images + category loaded. */
    public function forStore(): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'description' => $this->description,
            'emoji' => $this->emoji,
            'price' => $this->price,
            'old_price' => $this->old_price,
            'in_stock' => $this->in_stock,
            'category' => $this->category?->only('name', 'slug'),
            'images' => $this->images->map(fn ($i) => $i->url)->values()->all(),
            'variations' => $this->relationLoaded('variations')
                ? $this->variations->map(fn ($v) => [
                    'id' => $v->id,
                    'name' => $v->name,
                    'price' => $v->price,
                    'old_price' => $v->old_price,
                    'in_stock' => (bool) $v->in_stock,
                ])->values()->all()
                : [],
        ];
    }
}
