<?php
namespace Godukkan\Chatbot\Setup;

use Magento\Framework\Setup\InstallSchemaInterface;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\SchemaSetupInterface;
use Magento\Framework\DB\Ddl\Table;

class InstallSchema implements InstallSchemaInterface
{
    public function install(SchemaSetupInterface $setup, ModuleContextInterface $context)
    {
        $installer = $setup;
        $installer->startSetup();

        if (!$installer->tableExists('godukkan_chatbot_log')) {
            $table = $installer->getConnection()->newTable(
                $installer->getTable('godukkan_chatbot_log')
            )
                ->addColumn('log_id', Table::TYPE_INTEGER, null, [
                    'identity' => true,
                    'unsigned' => true,
                    'nullable' => false,
                    'primary'  => true,
                ], 'Log ID')
                ->addColumn('session_id', Table::TYPE_TEXT, 64, ['nullable' => false], 'Session ID')
                ->addColumn('user_name', Table::TYPE_TEXT, 255, ['nullable' => true], 'User Name')
                ->addColumn('user_email', Table::TYPE_TEXT, 255, ['nullable' => true], 'User Email')
                ->addColumn('message', Table::TYPE_TEXT, '64k', ['nullable' => false], 'Message')
                ->addColumn('sender', Table::TYPE_TEXT, 16, ['nullable' => false], 'Sender (user/bot/agent)')
                ->addColumn('created_at', Table::TYPE_TIMESTAMP, null, [
                    'nullable' => false,
                    'default' => Table::TIMESTAMP_INIT
                ], 'Created At')
                ->addIndex($installer->getIdxName('godukkan_chatbot_log', ['session_id']), ['session_id'])
                ->setComment('Godukkan Chatbot Conversation Log Table');
            $installer->getConnection()->createTable($table);
        }

        $installer->endSetup();
    }
} 