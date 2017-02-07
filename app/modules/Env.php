<?php

class Env
{
    public static function isProduction()
    {
        return defined('ENV') && ENV == 'production';
    }

    public static function isDev()
    {
        return defined('ENV') && ENV == 'dev';
    }

    public static function isLocal()
    {
        return defined('ENV') && ENV == 'local';
    }

    public static function getEnv()
    {
        return defined('ENV') ? ENV : '';
    }
}