<?php

class AltBaseUrlsTest extends StatusTest
{
    function run()
    {
        if (count(RedirectWhenBlockedFull::getAltBaseUrls()) == 0) {
            $this->messages[] = 'Empty alt base urls';
            return;
        }

        $domains = array();

        foreach (RedirectWhenBlockedFull::getAltBaseUrls() as $url) {
            // Test HTTP response code.
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
            $result = curl_exec($ch);
            $http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            if ($http_status == 200) {
                $this->messages[] = "$url passed ($http_status)";
            } else {
                $this->n_failed ++;
                $this->messages[] = "$url failed ($http_status)";
            }

            // Test DNS poisoning.
            $domain = parse_url($url, PHP_URL_HOST);
            $domains[] = $domain;
        }


        if (! Conf::$dns_poisoning_test_api) {
            $this->messages[] = 'dns_poisoning_test_api not set';
            $this->n_failed ++;
        } else {
            $api = new DNSTestAPI(Conf::$dns_poisoning_test_api);
            $n_domains_not_poisoned = 0;
            foreach ($domains as $domain) {
                $ret = $api->isDomainCensored($domain);
                if ($ret) {
                  $this->messages[] = $domain . ' is poisoned';
                } else {
                  $this->messages[] = $domain . ' is not poisoned';
                  $n_domains_not_poisoned++;
                }
            }

            if(!$n_domains_not_poisoned) {
                $this->messages[] = 'no unpoisoned domains available';
                $this->n_failed ++;
            }
        }

        $alt_base_urls_file = dirname(dirname(__DIR__)) .
             '/rwb/conf/alt_base_urls.txt';
        $alt_base_urls_modified_ago = time() - filemtime($alt_base_urls_file);
        $this->messages[] = "$alt_base_urls_file modified $alt_base_urls_modified_ago seconds ago";
        if ($alt_base_urls_modified_ago > Conf::$alt_base_urls_modified_ago_max) {
            $this->messages[] = "$alt_base_urls_file expired";
            return false;
        }
        return true;
    }
}


class DNSTestAPI {
  /**
  dns_poisoning_test_api example
  $api = "https://127.0.0.1/api";
  "$api/submit_domain?domain=twitter.com";
  Return:
    {"result": "success", "detection_id": 37}

  "$api/fetch_detection_result?id=12";
  Return:
    {
      "detection_result": "not_censored",
      "detection_finishes": "Tue Apr  7 09:26:45 2015",
      "domain_name": "twitter.com",
      "detection_starts": "Tue Apr  7 09:26:43 2015",
      "result": "success",
      "detection_method": 0
    }
  */
  private $api;
  public function __construct($api) {
    $this->api=$api;
  }
  public function isDomainCensored($domain) {
    $ret = $this->submitDomain($domain);
    $ret = $this->fetchResult($ret->detection_id);
    return $ret->detection_result == "censored";
  }

  private function submitDomain($domain) {
    $ret = file_get_contents($this->api."submit_domain?domain=$domain");
    return json_decode($ret);
  }
  private function fetchResult($id) {
    $ret = file_get_contents($this->api."fetch_detection_result?id=$id");
    return json_decode($ret);
  }



}













