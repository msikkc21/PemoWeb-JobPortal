@extends('layouts.app')

@section('content')
<div class="container">
    <h1>Daftar Pekerjaan</h1>

    @if($jobs->isEmpty())
        <p>Tidak ada pekerjaan tersedia.</p>
    @else
        <ul>
            @foreach($jobs as $job)
                <li>
                    <a href="{{ route('jobs.show', $job->id) }}">
                        {{ $job->judul ?? 'Tanpa Judul' }}
                    </a>
                </li>
            @endforeach
        </ul>
    @endif
</div>
@endsection
