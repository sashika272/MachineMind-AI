"""Initial schema creation for MachineMind AI

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-10-24 12:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # Users table
    op.create_table(
        'users',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('name', sa.String(length=128), nullable=False),
        sa.Column('role', sa.String(length=64), nullable=False),
        sa.Column('organization', sa.String(length=128), nullable=True),
        sa.Column('plant_location', sa.String(length=128), nullable=True),
        sa.Column('access_tier', sa.String(length=64), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('is_superuser', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    # Refresh tokens
    op.create_table(
        'refresh_tokens',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('token', sa.String(length=512), nullable=False),
        sa.Column('user_id', sa.String(length=64), nullable=False),
        sa.Column('expires_at', sa.DateTime(), nullable=False),
        sa.Column('revoked', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_refresh_tokens_token'), 'refresh_tokens', ['token'], unique=True)

    # Password reset tokens
    op.create_table(
        'password_reset_tokens',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('token', sa.String(length=128), nullable=False),
        sa.Column('user_id', sa.String(length=64), nullable=False),
        sa.Column('expires_at', sa.DateTime(), nullable=False),
        sa.Column('used', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_password_reset_tokens_token'), 'password_reset_tokens', ['token'], unique=True)

    # Machines table
    op.create_table(
        'machines',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('code', sa.String(length=64), nullable=False),
        sa.Column('name', sa.String(length=128), nullable=False),
        sa.Column('type', sa.String(length=64), nullable=False),
        sa.Column('location', sa.String(length=128), nullable=False),
        sa.Column('facility', sa.String(length=128), nullable=True),
        sa.Column('status', sa.String(length=32), nullable=True),
        sa.Column('health_score', sa.Float(), nullable=False),
        sa.Column('running_hours', sa.Float(), nullable=True),
        sa.Column('rpm', sa.Float(), nullable=True),
        sa.Column('temperature', sa.Float(), nullable=True),
        sa.Column('vibration', sa.Float(), nullable=True),
        sa.Column('pressure', sa.Float(), nullable=True),
        sa.Column('power_kw', sa.Float(), nullable=True),
        sa.Column('power_factor', sa.Float(), nullable=True),
        sa.Column('efficiency_percent', sa.Float(), nullable=True),
        sa.Column('noise_db', sa.Float(), nullable=True),
        sa.Column('last_maintenance', sa.String(length=32), nullable=True),
        sa.Column('next_scheduled_service', sa.String(length=32), nullable=True),
        sa.Column('model_specs', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_machines_code'), 'machines', ['code'], unique=True)
    op.create_index(op.f('ix_machines_status'), 'machines', ['status'], unique=False)

    # Machine Components table
    op.create_table(
        'machine_components',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('machine_id', sa.String(length=64), nullable=False),
        sa.Column('name', sa.String(length=128), nullable=False),
        sa.Column('type', sa.String(length=64), nullable=False),
        sa.Column('status', sa.String(length=32), nullable=True),
        sa.Column('health_score', sa.Float(), nullable=True),
        sa.Column('temperature', sa.Float(), nullable=True),
        sa.Column('vibration', sa.Float(), nullable=True),
        sa.Column('failure_probability', sa.Float(), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('position_3d', sa.JSON(), nullable=True),
        sa.Column('recommendation', sa.Text(), nullable=True),
        sa.Column('inspected_date', sa.String(length=32), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['machine_id'], ['machines.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_machine_components_machine_id'), 'machine_components', ['machine_id'], unique=False)

    # Sensor readings table
    op.create_table(
        'sensor_readings',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('machine_id', sa.String(length=64), nullable=False),
        sa.Column('timestamp', sa.DateTime(), nullable=False),
        sa.Column('time_str', sa.String(length=32), nullable=False),
        sa.Column('temperature', sa.Float(), nullable=False),
        sa.Column('vibration', sa.Float(), nullable=False),
        sa.Column('pressure', sa.Float(), nullable=False),
        sa.Column('rpm', sa.Float(), nullable=False),
        sa.Column('power_kw', sa.Float(), nullable=True),
        sa.Column('acoustic_db', sa.Float(), nullable=True),
        sa.Column('anomaly_score', sa.Float(), nullable=True),
        sa.Column('is_simulated', sa.Boolean(), nullable=False),
        sa.Column('simulation_scenario', sa.String(length=64), nullable=True),
        sa.ForeignKeyConstraint(['machine_id'], ['machines.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_sensor_readings_machine_id'), 'sensor_readings', ['machine_id'], unique=False)
    op.create_index(op.f('ix_sensor_readings_timestamp'), 'sensor_readings', ['timestamp'], unique=False)

    # Detected Faults table
    op.create_table(
        'detected_faults',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('machine_id', sa.String(length=64), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('severity', sa.String(length=32), nullable=True),
        sa.Column('status', sa.String(length=32), nullable=True),
        sa.Column('detected_at', sa.DateTime(), nullable=False),
        sa.Column('detected_at_str', sa.String(length=64), nullable=False),
        sa.Column('affected_component_type', sa.String(length=64), nullable=False),
        sa.Column('affected_component_name', sa.String(length=128), nullable=False),
        sa.Column('confidence_score', sa.Float(), nullable=True),
        sa.Column('primary_cause', sa.Text(), nullable=False),
        sa.Column('summary', sa.Text(), nullable=False),
        sa.Column('estimated_degradation_days', sa.Float(), nullable=True),
        sa.Column('sensor_evidence', sa.JSON(), nullable=True),
        sa.Column('spectral_signature', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['machine_id'], ['machines.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_detected_faults_machine_id'), 'detected_faults', ['machine_id'], unique=False)
    op.create_index(op.f('ix_detected_faults_severity'), 'detected_faults', ['severity'], unique=False)
    op.create_index(op.f('ix_detected_faults_status'), 'detected_faults', ['status'], unique=False)

    # Root Cause Investigations
    op.create_table(
        'root_cause_investigations',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('fault_id', sa.String(length=64), nullable=False),
        sa.Column('component_id', sa.String(length=64), nullable=True),
        sa.Column('primary_root_cause', sa.Text(), nullable=False),
        sa.Column('confidence_percent', sa.Float(), nullable=True),
        sa.Column('uncertainty_lower', sa.Float(), nullable=True),
        sa.Column('uncertainty_upper', sa.Float(), nullable=True),
        sa.Column('causal_chain', sa.JSON(), nullable=True),
        sa.Column('contributing_factors', sa.JSON(), nullable=True),
        sa.Column('supporting_telemetry', sa.JSON(), nullable=True),
        sa.Column('recommendations', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['component_id'], ['machine_components.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['fault_id'], ['detected_faults.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_root_cause_investigations_fault_id'), 'root_cause_investigations', ['fault_id'], unique=False)

    # Repair Strategies table
    op.create_table(
        'repair_strategies',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('fault_id', sa.String(length=64), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('tier', sa.String(length=32), nullable=True),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('estimated_cost_usd', sa.Float(), nullable=False),
        sa.Column('recovery_time_hours', sa.Float(), nullable=False),
        sa.Column('downtime_hours', sa.Float(), nullable=False),
        sa.Column('loto_required', sa.Boolean(), nullable=True),
        sa.Column('safety_requirements', sa.JSON(), nullable=True),
        sa.Column('required_parts', sa.JSON(), nullable=True),
        sa.Column('procedure_steps', sa.JSON(), nullable=True),
        sa.Column('expected_outcome', sa.JSON(), nullable=True),
        sa.Column('efficiency_impact_percent', sa.Float(), nullable=True),
        sa.Column('recommendation_score', sa.Float(), nullable=True),
        sa.Column('is_recommended', sa.Boolean(), nullable=True),
        sa.Column('tradeoffs', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['fault_id'], ['detected_faults.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_repair_strategies_fault_id'), 'repair_strategies', ['fault_id'], unique=False)

    # Simulation sessions & results
    op.create_table(
        'simulation_sessions',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('machine_id', sa.String(length=64), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('target_rpm', sa.Float(), nullable=True),
        sa.Column('load_percentage', sa.Float(), nullable=True),
        sa.Column('ambient_temp_c', sa.Float(), nullable=True),
        sa.Column('lubrication_quality_percent', sa.Float(), nullable=True),
        sa.Column('cooling_airflow_percent', sa.Float(), nullable=True),
        sa.Column('applied_strategy_id', sa.String(length=64), nullable=True),
        sa.Column('assumptions_log', sa.JSON(), nullable=True),
        sa.ForeignKeyConstraint(['machine_id'], ['machines.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'simulation_results',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('session_id', sa.String(length=64), nullable=False),
        sa.Column('strategy_id', sa.String(length=64), nullable=True),
        sa.Column('simulated_health', sa.Float(), nullable=False),
        sa.Column('projected_temp', sa.Float(), nullable=False),
        sa.Column('projected_vibration', sa.Float(), nullable=False),
        sa.Column('projected_rpm', sa.Float(), nullable=False),
        sa.Column('projected_power_kw', sa.Float(), nullable=False),
        sa.Column('rul_days_post_fix', sa.Float(), nullable=False),
        sa.Column('failure_risk_percent', sa.Float(), nullable=False),
        sa.Column('energy_savings_kwh_month', sa.Float(), nullable=True),
        sa.Column('passed_safety_constraints', sa.Boolean(), nullable=True),
        sa.Column('explanation', sa.Text(), nullable=False),
        sa.Column('stress_distribution', sa.JSON(), nullable=True),
        sa.Column('telemetry_stream', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['session_id'], ['simulation_sessions.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['strategy_id'], ['repair_strategies.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )

    # Maintenance records & schedules
    op.create_table(
        'maintenance_records',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('machine_id', sa.String(length=64), nullable=False),
        sa.Column('date_str', sa.String(length=32), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('type', sa.String(length=64), nullable=False),
        sa.Column('severity', sa.String(length=32), nullable=True),
        sa.Column('technician', sa.String(length=128), nullable=False),
        sa.Column('duration_hours', sa.Float(), nullable=True),
        sa.Column('cost_usd', sa.Float(), nullable=True),
        sa.Column('resolution', sa.Text(), nullable=False),
        sa.Column('parts_replaced', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['machine_id'], ['machines.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'maintenance_schedules',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('machine_id', sa.String(length=64), nullable=False),
        sa.Column('scheduled_date_str', sa.String(length=32), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('urgency', sa.String(length=32), nullable=True),
        sa.Column('component_name', sa.String(length=128), nullable=False),
        sa.Column('technician', sa.String(length=128), nullable=True),
        sa.Column('status', sa.String(length=32), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['machine_id'], ['machines.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # Notifications table
    op.create_table(
        'notifications',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('user_id', sa.String(length=64), nullable=True),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('severity', sa.String(length=32), nullable=True),
        sa.Column('read', sa.Boolean(), nullable=False),
        sa.Column('target_view', sa.String(length=64), nullable=True),
        sa.Column('timestamp_str', sa.String(length=32), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_notifications_read'), 'notifications', ['read'], unique=False)

    # Audit logs table
    op.create_table(
        'audit_logs',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('user_id', sa.String(length=64), nullable=True),
        sa.Column('action', sa.String(length=64), nullable=False),
        sa.Column('resource_type', sa.String(length=64), nullable=False),
        sa.Column('resource_id', sa.String(length=64), nullable=True),
        sa.Column('details', sa.JSON(), nullable=True),
        sa.Column('ip_address', sa.String(length=64), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_audit_logs_action'), 'audit_logs', ['action'], unique=False)
    op.create_index(op.f('ix_audit_logs_created_at'), 'audit_logs', ['created_at'], unique=False)

def downgrade() -> None:
    op.drop_table('audit_logs')
    op.drop_table('notifications')
    op.drop_table('maintenance_schedules')
    op.drop_table('maintenance_records')
    op.drop_table('simulation_results')
    op.drop_table('simulation_sessions')
    op.drop_table('repair_strategies')
    op.drop_table('root_cause_investigations')
    op.drop_table('detected_faults')
    op.drop_table('sensor_readings')
    op.drop_table('machine_components')
    op.drop_table('machines')
    op.drop_table('password_reset_tokens')
    op.drop_table('refresh_tokens')
    op.drop_table('users')
