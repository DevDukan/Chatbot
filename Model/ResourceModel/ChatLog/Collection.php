<?php
namespace Godukkan\Chatbot\Model\ResourceModel\ChatLog;

use Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection;

class Collection extends AbstractCollection
{
    protected function _construct()
    {
        $this->_init(
            'Godukkan\Chatbot\Model\ChatLog',
            'Godukkan\Chatbot\Model\ResourceModel\ChatLog'
        );
    }
} 